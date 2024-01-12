'use server'

import os from 'node:os'

import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { NoteEditorSchema, imageHasFile, imageHasId } from './schemas'
import { parse } from '@conform-to/zod'
import { honeypot, checkHoneypot } from '@/app/utils/honeypot.server'
import { prisma } from '@/app/utils/db'
import { createId as cuid } from '@paralleldrive/cuid2'

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
		user: { id: user.id, name: user?.name, username: user?.username },
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

	const userId = formData.get('userId') as string

	const updatedNote = await prisma.note.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: noteId ?? '__new_note__' },
		create: {
			ownerId: userId,
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

	const username = formData.get('username')

	invariant(username, `No username exists`)

	revalidatePath(`/users/${username}/notes/${noteId}/edit`)
	revalidatePath(`/users/${username}/notes/${noteId}`)
	redirect(`/users/${username}/notes/${noteId}`)
}

export async function SignUp(formData: FormData) {
	checkHoneypot(formData)

	const email = formData.get('email')
	const password = formData.get('password')

	// implement signup later
	// return redirect('/')
}
