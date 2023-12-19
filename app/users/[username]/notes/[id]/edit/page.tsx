import { db } from '@/app/lib/db.server'
import { invariantResponse } from '@/app/lib/misc'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Textarea } from '@/app/comps/ui/textarea'
import { StatusButton } from '@/app/comps/ui/status-button'
import { revalidatePath } from 'next/cache'

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

	invariantResponse(note, 'Note not found', { status: 404 })

	return {
		note: { title: note.title, content: note.content },
	}
}

async function action({ params }: Props, formData: FormData) {
	'use server'

	const title = formData.get('title')
	const content = formData.get('content')

	invariantResponse(typeof title === 'string', 'title must be a string')
	invariantResponse(typeof content === 'string', 'content must be a string')

	db.note.update({
		where: { id: { equals: params.id } },
		data: { title, content },
	})

	revalidatePath(`/users/${params.username}/notes/${params.id}/edit`)
}

export default async function NoteEdit(props: Props) {
	const data = await loader(props)

	const updateNoteWithId = action.bind(null, props)
	return (
		<form
			method="POST"
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
			action={updateNoteWithId}
		>
			<div className="flex flex-col gap-1">
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Title</Label>
					<Input name="title" defaultValue={data.note.title} />
				</div>
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Content</Label>
					<Textarea name="content" defaultValue={data.note.content} />
				</div>
			</div>
			<div className={floatingToolbarClassName}>
				<Button variant="destructive" type="reset">
					Reset
				</Button>
				<StatusButton type="submit" disabled={false}>
					Submit
				</StatusButton>
			</div>
		</form>
	)
}
