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
			noteId,
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
	const titleMinLength = 1
	const titleMaxLength = 100
	const contentMinLength = 1
	const contentMaxLength = 10000

	const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

	const ImageFieldsetSchema = z.object({
		imageId: z.string().optional(),
		file: z
			.instanceof(File)
			.optional()
			.refine(file => {
				return !file || file.size <= MAX_UPLOAD_SIZE
			}, 'File size must be less than 3MB'),
		altText: z.string().optional(),
	})

	type ImageFieldset = z.infer<typeof ImageFieldsetSchema>

	function isImageFieldset(obj: any): obj is ImageFieldset {
		try {
			ImageFieldsetSchema.parse(obj)
			return true
		} catch (error) {
			if (error instanceof z.ZodError) {
				return false
			}
			throw error // rethrow if it's not a ZodError
		}
	}

	const NoteEditorSchema = z.object({
		id: z.string(),
		title: z.string().min(titleMinLength).max(titleMaxLength),
		content: z.string().min(contentMinLength).max(contentMaxLength),
		images: z.array(ImageFieldsetSchema).max(5).optional(),
	})
	const imageIds = formData.getAll('imageId')
	const files = formData.getAll('file')
	const altText = formData.getAll('altText')

	const mergedArray: ImageFieldset[] = []

	for (let i = 0; i < files.length; i++) {
		const obj = {
			imageId: imageIds[i],
			file: files[i],
			altText: altText[i],
		}
		if (isImageFieldset(obj)) mergedArray.push(obj)
	}

	const validatedFields = NoteEditorSchema.safeParse({
		id: formData.get('id'),
		title: formData.get('title'),
		content: formData.get('content'),
		images: mergedArray,
	})

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		console.log(validatedFields.error.flatten())
		return {
			fieldErrors: validatedFields.error.flatten().fieldErrors,
			formErrors: validatedFields.error.flatten().formErrors,
		}
	}

	const { id, title, content, images } = validatedFields.data

	await updateNote({
		id,
		title,
		content,
		images: images?.map(({ imageId, ...rest }) => ({ id: imageId, ...rest })),
	})

	const username = formData.get('username')

	invariant(username, `No user with the username ${username} exists`)

	revalidatePath(`/users/${username}/notes/${id}/edit`)
}
