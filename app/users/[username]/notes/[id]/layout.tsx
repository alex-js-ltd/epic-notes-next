import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'

type Props = { params: { id: string; username: string } }

async function loader({ params }: Props) {
	'use server'

	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.id,
			},
		},
	})

	invariant(note, 'Note not found')

	return {
		note: { title: note.title, content: note.content },
	}
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const data = await loader(props)

	const displayName = props.params.username ?? ''
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
