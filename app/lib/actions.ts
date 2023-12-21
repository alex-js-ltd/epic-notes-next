'use server'

import os from 'node:os'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
		note: { title: note.title, content: note.content },
	}
}

export async function removeNote(noteId: string, formData: FormData) {
	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: noteId } } })

	redirect(`/users/${noteId}/notes`)
}

export async function updateNote(
	{ noteId, username }: { noteId: string; username: string },
	formData: FormData,
) {
	const title = formData.get('title')
	const content = formData.get('content')

	invariant(typeof title === 'string', 'title must be a string')
	invariant(typeof content === 'string', 'content must be a string')

	db.note.update({
		where: { id: { equals: noteId } },
		data: { title, content },
	})

	revalidatePath(`/users/${username}/notes/${noteId}/edit`)
}
