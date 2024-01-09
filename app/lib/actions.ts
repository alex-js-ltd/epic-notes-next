'use server'

import os from 'node:os'
import { db, updateNote } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { NoteEditorSchema } from './schemas'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { Note } from './schemas'

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

export async function removeNote(
	{ noteId, username }: { noteId: string; username: string },
	formData: FormData,
) {
	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: noteId } } })

	redirect(`/users/${username}/notes`)
}

export async function editNote(_prevState: unknown, formData: FormData) {
	const submission = parse(formData, {
		schema: NoteEditorSchema,
	})

	if (!submission.value) {
		return { status: 'error', error: submission?.error }
	}

	const { id, title, content, images } = submission.value
	await updateNote({ id, title, content, images })

	const username = formData.get('username')

	invariant(username, `No username exists`)

	revalidatePath(`/users/${username}/notes/${id}/edit`)
	revalidatePath(`/users/${username}/notes/${id}`)
	redirect(`/users/${username}/notes/${id}`)
}

export async function SignUp(formData: FormData) {
	invariant(!formData.get('name'), 'Form not submitted properly')
	// implement signup later
	return redirect('/')
}
