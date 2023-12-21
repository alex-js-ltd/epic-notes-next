import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { loadNote } from '@/app/lib/actions'

export async function generateMetadata({
	params: { noteId, username },
}: {
	params: { noteId: string; username: string }
}): Promise<Metadata> {
	const data = await loadNote(noteId)

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
