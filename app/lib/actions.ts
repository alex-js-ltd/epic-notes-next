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

	const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

	const noteEditorSchema = z.object({
		id: z.string(),
		title: z.string().max(titleMaxLength),
		content: z.string().max(contentMaxLength),
		// 🐨 add imageId, file, and altText fields here (they should all be optional)
		// 🐨 make sure the file is no larger than the MAX_UPLOAD_SIZE
		imageId: z.string().optional(),
		file: z
			.instanceof(File)
			.refine(file => {
				return file.size <= MAX_UPLOAD_SIZE
			}, 'File size must be less than 3MB')
			.optional(),
		altText: z.string().optional(),
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

	const { id, title, content, username, altText, file, imageId } =
		validatedFields.data

	await updateNote({
		id,
		title,
		content,
		images: [{ file, id: imageId, altText }],
	})

	revalidatePath(`/users/${username}/notes/${id}/edit`)
}
