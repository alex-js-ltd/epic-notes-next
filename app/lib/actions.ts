'use server'

import os from 'node:os'
import { db, updateNote } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function loadUserInfo() {
	return { username: os.userInfo().username }
}

export async function loadUser(username: string) {
	const user = db.user.findFirst({
		where: {
			username: {
				equals: username,
			},
		},
	})

	invariant(user, `No user with the username ${username} exists`)

	return {
		user: { name: user.name, username: user.username },
	}
}

export async function loadNotes(username: string) {
	const notes = db.note
		.findMany({
			where: {
				owner: {
					username: {
						equals: username,
					},
				},
			},
		})
		.map(({ id, title }) => ({ id, title }))

	invariant(notes, `Notes not found`)

	return { notes }
}

export async function loadNote(noteId: string) {
	const note = db.note.findFirst({
		where: {
			id: {
				equals: noteId,
			},
		},
	})

	invariant(note, `No note with the id ${noteId} exists`)

	return {
		note: {
			title: note.title,
			content: note.content,
			images: note.images.map(i => ({
				id: i.id,
				altText: i.altText,
			})),
		},
	}
}

export async function removeNote(noteId: string, formData: FormData) {
	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: noteId } } })

	redirect(`/users/${noteId}/notes`)
}

export async function editNote(_prevState: unknown, formData: FormData) {
	const titleMaxLength = 100
	const contentMaxLength = 10000

	const noteEditorSchema = z.object({
		title: z
			.string()
			.min(1, { message: 'Title is required' })
			.max(titleMaxLength),
		content: z
			.string()
			.min(1, { message: 'Content is required' })
			.max(contentMaxLength),
		id: z.string(),
		username: z.string(),
	})
	const formBody = Object.fromEntries(formData.entries())

	const validatedFields = noteEditorSchema.safeParse(formBody)

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		return {
			fieldErrors: validatedFields.error.flatten().fieldErrors,
			formErrors: validatedFields.error.flatten().formErrors,
		}
	}

	const { id, title, content, username } = validatedFields.data

	await updateNote({
		id,
		title,
		content,
		images: [
			{
				// @ts-expect-error 🦺 we'll fix this in the next exercise
				id: formData.get('imageId'),
				// @ts-expect-error 🦺 we'll fix this in the next exercise
				file: formData.get('file'),
				// @ts-expect-error 🦺 we'll fix this in the next exercise
				altText: formData.get('altText'),
			},
		],
	})

	revalidatePath(`/users/${username}/notes/${id}/edit`)
}
