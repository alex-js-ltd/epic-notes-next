'use client'

import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Textarea } from '@/app/comps/ui/textarea'
import { StatusButton } from '@/app/comps/ui/status-button'
import { editNote } from '@/app/lib/actions'
import { useFocusInvalid } from '../lib/hooks'

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
	const formRef = useRef<HTMLFormElement>(null)

	const [state, formAction] = useFormState(editNote, null)

	const formId = 'note-editor'

	const formHasErrors = Boolean(state?.formErrors?.length)
	const formErrorId = formHasErrors ? 'form-error' : undefined
	const titleHasErrors = Boolean(state?.fieldErrors?.title?.length)
	const titleErrorId = titleHasErrors ? 'title-error' : undefined
	const contentHasErrors = Boolean(state?.fieldErrors?.content?.length)
	const contentErrorId = contentHasErrors ? 'content-error' : undefined

	useFocusInvalid(formRef.current, state?.status === 'error')

	return (
		<form
			id={formId}
			method="POST"
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
			action={formAction}
			aria-invalid={formHasErrors || undefined}
			aria-describedby={formErrorId}
			ref={formRef}
			tabIndex={-1}
		>
			<div className="flex flex-col gap-1">
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label htmlFor="note-title">Title</Label>
					<Input
						id="note-title"
						name="title"
						defaultValue={title}
						maxLength={100}
						// required
						aria-invalid={titleHasErrors || undefined}
						aria-describedby={titleErrorId}
						autoFocus
					/>

					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList errors={state?.fieldErrors?.title} />
					</div>
				</div>
				<div>
					{/* 🦉 NOTE: this is not an accessible label, we'll get to that in the accessibility exercises */}
					<Label htmlFor="note-content">Content</Label>
					<Textarea
						id="note-content"
						name="content"
						defaultValue={content}
						// required
						maxLength={10000}
						aria-invalid={contentHasErrors || undefined}
						aria-describedby={contentErrorId}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList errors={state?.fieldErrors?.content} />
					</div>
				</div>
			</div>
			<div className={floatingToolbarClassName}>
				<Button form={formId} variant="destructive" type="reset">
					Reset
				</Button>
				<StatusButton type="submit" disabled={false}>
					Submit
				</StatusButton>
			</div>

			<ErrorList errors={state?.formErrors} />

			<input type="hidden" name="id" value={noteId} required />
			<input type="hidden" name="username" value={username} required />
		</form>
	)
}

function ErrorList({ errors }: { errors?: Array<string> | null }) {
	return errors?.length ? (
		<ul className="flex flex-col gap-1">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null
}
