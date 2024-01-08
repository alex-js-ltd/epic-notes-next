'use server'

import os from 'node:os'
import { db, updateNote } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { NoteEditorSchema } from './schemas'

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

export async function removeNote(noteId: string, formData: FormData) {
	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: noteId } } })

	redirect(`/users/${noteId}/notes`)
}

function getImages(formData: FormData) {
	const imageIds = formData.getAll('imageId')
	const files = formData.getAll('file')
	const altTexts = formData.getAll('altText')

	return imageIds.map((imageId, index) => ({
		id: imageId,
		file: files[index],
		altText: altTexts[index],
	}))
}

export async function editNote(_prevState: unknown, formData: FormData) {
	console.log('form action fired')

	const data = {
		id: formData.get('id'),
		title: formData.get('title'),
		content: formData.get('content'),
		images: [...getImages(formData)],
		username: formData.get('username'),
	}

	console.log(data)

	const validatedFields = NoteEditorSchema.safeParse(data)

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		console.log(validatedFields.error.flatten())
		return {
			fieldErrors: validatedFields.error.flatten().fieldErrors,
			formErrors: validatedFields.error.flatten().formErrors,
		}
	}

	const { id, title, content, images, username } = validatedFields.data

	await updateNote({
		id,
		title,
		content,
		images,
	})

	revalidatePath(`/users/${username}/notes/${id}/edit`)
}
