import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/app/lib/db.server'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
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

	invariant(note, `No note with the id ${params.id} exists`)

	return {
		note: { title: note.title, content: note.content },
	}
}

async function action({ params }: Props, formData: FormData) {
	'use server'

	const intent = formData.get('intent')

	invariant(intent === 'delete', 'Invalid intent')

	db.note.delete({ where: { id: { equals: params.id } } })

	redirect(`/users/${params.username}/notes`)
}

export default async function NoteRoute(props: Props) {
	const data = await loader(props)

	const deleteNoteWithId = action.bind(null, props)

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
					<Link
						href={`/users/${props.params.username}/notes/${props.params.id}/edit`}
					>
						Edit
					</Link>
				</Button>
			</div>
		</div>
	)
}
