'use client'

import { useFormState } from 'react-dom'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Textarea } from '@/app/comps/ui/textarea'
import { StatusButton } from '@/app/comps/ui/status-button'

import { editNote } from '@/app/lib/actions'

export default function EditForm({
	noteId,
	title,
	content,
	username,
}: {
	noteId: string
	title: string
	content: string
	username: string
}) {
	const [state, formAction] = useFormState(editNote, null)

	return (
		<form
			method="POST"
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
			action={formAction}
		>
			<div className="flex flex-col gap-1">
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Title</Label>
					<Input name="title" defaultValue={title} required maxLength={100} />
				</div>
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label>Content</Label>
					<Textarea
						name="content"
						defaultValue={content}
						required
						maxLength={10000}
					/>
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

			<input type="hidden" name="id" value={noteId} />
			<input type="hidden" name="username" value={username} />
		</form>
	)
}
