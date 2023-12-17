import Link from 'next/link'
import { db } from '@/app/lib/db.server'
import { invariantResponse } from '@/app/lib/misc'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'

type Props = { params: { id: string } }

export async function loader({ params }: Props) {
	'use server'

	const note = db.note.findFirst({
		where: {
			id: {
				equals: params.id,
			},
		},
	})

	invariantResponse(note, 'Note not found', { status: 404 })

	return {
		note: { title: note.title, content: note.content },
	}
}

export default async function NoteRoute(props: Props) {
	const data = await loader(props)

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.note.title}</h2>
			<div className="overflow-y-auto pb-24">
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.note.content}
				</p>
			</div>
			<div className={floatingToolbarClassName}>
				<form method="POST">
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
					<Link href="edit">Edit</Link>
				</Button>
			</div>
		</div>
	)
}
