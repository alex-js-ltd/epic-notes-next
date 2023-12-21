import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/app/lib/db.server'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
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

async function action(noteId: string, formData: FormData) {
	'use server'

	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: noteId } } })

	redirect(`/users/${noteId}/notes`)
}

export default async function NoteRoute({
	params: { noteId, username },
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loader(noteId)

	const deleteNoteWithId = action.bind(null, noteId)

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.note.title}</h2>
			<div className="overflow-y-auto pb-24">
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.note.content}
				</p>
			</div>
			<div className={floatingToolbarClassName}>
				<form method="POST" action={deleteNoteWithId}>
					<Button
						type="submit"
						variant="destructive"
						name="intent"
						value="delete"
					>
						Delete
					</Button>
				</form>
				<Button asChild>
					<Link href={`/users/${username}/notes/${noteId}/edit`}>Edit</Link>
				</Button>
			</div>
		</div>
	)
}
