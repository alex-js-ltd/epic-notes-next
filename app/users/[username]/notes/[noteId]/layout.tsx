import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'

async function loader(noteId: string) {
	'use server'

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

export async function generateMetadata({
	params: { noteId, username },
}: {
	params: { noteId: string; username: string }
}): Promise<Metadata> {
	const data = await loader(noteId)

	const displayName = username ?? ''
	const noteTitle = data?.note.title ?? 'Note'
	const noteContentsSummary =
		data && data.note.content.length > 100
			? data?.note.content.slice(0, 97) + '...'
			: 'No content'

	return {
		title: `${noteTitle} | ${displayName}'s Notes | Epic Notes`,
		description: noteContentsSummary,
	}
}

export default function ({ children }: { children: ReactNode }) {
	return children
}
