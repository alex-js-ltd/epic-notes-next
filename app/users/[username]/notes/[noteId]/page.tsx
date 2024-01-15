import Link from 'next/link'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
import { loadNote, removeNote } from '@/app/utils/actions'
import { getNoteImgSrc } from '@/app/utils/misc'
import { auth } from '@clerk/nextjs'

export default async function NoteRoute({
	params: { noteId, username },
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(noteId)

	const deleteNoteWithId = removeNote.bind(null, { noteId, username })

	const { userId } = auth()
	const isOwner = userId === data.note.ownerId

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.note.title}</h2>
			<div className="overflow-y-auto pb-24">
				<ul className="flex flex-wrap gap-5 py-5">
					{data.note.images.map(image => (
						<li key={image.id}>
							<a href={getNoteImgSrc(image.id)}>
								<img
									src={getNoteImgSrc(image.id)}
									alt={image.altText ?? ''}
									className="h-32 w-32 rounded-lg object-cover"
								/>
							</a>
						</li>
					))}
				</ul>
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.note.content}
				</p>
			</div>
			{isOwner ? (
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
			) : null}
		</div>
	)
}
