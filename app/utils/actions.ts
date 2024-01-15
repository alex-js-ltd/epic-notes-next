'use server'

import os from 'node:os'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
	NoteEditorSchema,
	imageHasFile,
	imageHasId,
	OnboardingFormSchema,
	UserSearchResultsSchema,
} from './schemas'
import { parse } from '@conform-to/zod'
import { honeypot } from '@/app/utils/honeypot.server'
import { prisma } from '@/app/utils/db'
import { createId as cuid } from '@paralleldrive/cuid2'
import { signup } from '@/app/utils/auth'
import { z } from 'zod'

export async function loadUserInfo() {
	const honeyProps = honeypot.getInputProps()

	return { username: os.userInfo().username, honeyProps }
}

export async function loadUser(username: string) {
	const user = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
		},
		where: {
			username: username,
		},
	})

	invariant(user, `No user with the username ${username} exists`)

	return {
		user,
	}
}

export async function loadOwner(username: string) {
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			notes: { select: { id: true, title: true } },
		},
		where: { username: username },
	})

	invariant(owner, `Owner not found`)

	return { owner }
}

export async function loadNote(noteId: string) {
	const note = await prisma.note.findUnique({
		where: { id: noteId },
		select: {
			id: true,
			title: true,
			content: true,
			ownerId: true,
			updatedAt: true,
			images: {
				select: {
					id: true,
					altText: true,
				},
			},
		},
	})

	invariant(note, `No note with the id ${noteId} exists`)

	return {
		note: {
			id: noteId,
			title: note.title,
			content: note.content,
			images: note.images.map(i => ({
				id: i.id,
				altText: i.altText,
			})),
			ownerId: note.ownerId,
		},
	}
}

export async function removeNote(
	{ noteId, username }: { noteId: string; username: string },
	formData: FormData,
) {
	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	await prisma.note.delete({ where: { id: noteId } })

	redirect(`/users/${username}/notes`)
}

export async function editNote(_prevState: unknown, formData: FormData) {
	const submission = await parse(formData, {
		schema: NoteEditorSchema.transform(async ({ images = [], ...data }) => {
			return {
				...data,
				imageUpdates: await Promise.all(
					images.filter(imageHasId).map(async i => {
						if (imageHasFile(i)) {
							return {
								id: i.id,
								altText: i.altText,
								contentType: i.file.type,
								blob: Buffer.from(await i.file.arrayBuffer()),
							}
						} else {
							return { id: i.id, altText: i.altText }
						}
					}),
				),
				newImages: await Promise.all(
					images
						.filter(imageHasFile)
						.filter(i => !i.id)
						.map(async image => {
							return {
								altText: image.altText,
								contentType: image.file.type,
								blob: Buffer.from(await image.file.arrayBuffer()),
							}
						}),
				),
			}
		}),
		async: true,
	})

	if (!submission.value) {
		return { status: 'error', error: submission?.error }
	}

	const {
		id: noteId,
		title,
		content,
		imageUpdates = [],
		newImages = [],
	} = submission.value

	const username = formData.get('username')

	invariant(typeof username === 'string')

	const { user } = await loadUser(username)

	const updatedNote = await prisma.note.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: noteId ?? '__new_note__' },
		create: {
			ownerId: user.id,
			title,
			content,
			images: { create: newImages },
		},
		update: {
			title,
			content,
			images: {
				deleteMany: { id: { notIn: imageUpdates.map(i => i.id) } },
				updateMany: imageUpdates.map(updates => ({
					where: { id: updates.id },
					data: { ...updates, id: updates.blob ? cuid() : updates.id },
				})),
				create: newImages,
			},
		},
	})

	revalidatePath(`/users/${username}/notes/${updatedNote.id}/edit`)
	revalidatePath(`/users/${username}/notes/${updatedNote.id}`)
	redirect(`/users/${username}/notes/${updatedNote.id}`)
}

export async function onBoardUser(formData: FormData) {
	const submission = await parse(formData, {
		schema: OnboardingFormSchema.superRefine(async (data, ctx) => {
			const existingUser = await prisma.user.findUnique({
				where: { username: data.username },
				select: { id: true },
			})
			if (existingUser) {
				ctx.addIssue({
					path: ['username'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this username',
				})
				return
			}
		}).transform(async data => {
			const session = await signup({ ...data })
			return { ...data, session }
		}),
		async: true,
	})

	if (!submission.value) {
		return { status: 'error', error: submission.error }
	}

	redirect(`/users`)
}

export async function searchUsers(_prevState: unknown, formData: FormData) {
	const searchTerm = formData.get('search')

	const like = `%${searchTerm ?? ''}%`

	const rawUsers = await prisma.user.findMany({
		where: {
			username: {
				startsWith: like,
				mode: 'insensitive',
			},
		},
		select: {
			id: true,
			username: true,
			name: true,
			image: {
				select: {
					id: true,
				},
			},
		},
	})

	const users = rawUsers?.map(({ image, ...rest }) => ({
		imageId: image?.id ?? null,
		...rest,
	}))

	const result = UserSearchResultsSchema.safeParse(users)

	if (!result.success) {
		console.log(result.error.message)
		return { status: 'error', error: result.error.message }
	}

	return { status: 'idle', users: result.data }
}
