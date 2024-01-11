'use server'

import os from 'node:os'
import { db, updateNote } from '@/app/utils/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { NoteEditorSchema } from './schemas'
import { parse } from '@conform-to/zod'
import { honeypot, checkHoneypot } from '@/app/utils/honeypot.server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loadUserInfo() {
	const honeyProps = honeypot.getInputProps()
	return { username: os.userInfo().username, honeyProps }
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
	checkHoneypot(formData)
	authenticate('hello', formData)
	// implement signup later
	// return redirect('/')
}

export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		await signIn('credentials', formData)
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.'
				default:
					return 'Something went wrong.'
			}
		}
		throw error
	}
}
