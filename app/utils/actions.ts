'use server'

import os from 'node:os'
import { db, updateNote } from '@/app/utils/db.server'
import invariant from 'tiny-invariant'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { NoteEditorSchema } from './schemas'
import { parse } from '@conform-to/zod'
import { honeypot, checkHoneypot } from '@/app/utils/honeypot.server'
import { prisma } from '@/app/utils/db'

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
		user: { name: user?.name, username: user?.username },
	}
}

export async function loadNotes(username: string) {
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

	invariant(owner?.notes, `Notes not found`)

	return { notes: owner.notes }
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

	const email = formData.get('email')
	const password = formData.get('password')

	// implement signup later
	// return redirect('/')
}
