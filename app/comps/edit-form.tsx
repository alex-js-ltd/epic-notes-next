'use client'

import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useFormState } from 'react-dom'
import { Button } from '@/app/comps/ui/button'
import { floatingToolbarClassName } from '@/app/comps/floating-toolbar'
import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Textarea } from '@/app/comps/ui/textarea'
import { StatusButton } from '@/app/comps/ui/status-button'
import { editNote } from '@/app/lib/actions'
import { useFocusInvalid, useHydrated } from '../lib/hooks'
import { cn } from '../lib/misc'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NoteEditorSchema } from '../lib/schemas'

export default function EditForm({
	note,
}: {
	note: {
		id: string
		title: string
		content: string
		images: Array<{
			id: string
			altText: string | undefined
			file: File | undefined
		}>
	}
}) {
	const formRef = useRef<HTMLFormElement>(null)

	const params = useParams<{ noteId: string; username: string }>()

	const [state, formAction] = useFormState(editNote, null)

	const formId = 'note-editor'

	const formHasErrors = Boolean(state?.formErrors?.length)
	const formErrorId = formHasErrors ? 'form-error' : undefined
	const titleHasErrors = Boolean(state?.fieldErrors?.title?.length)
	const titleErrorId = titleHasErrors ? 'title-error' : undefined
	const contentHasErrors = Boolean(state?.fieldErrors?.content?.length)
	const contentErrorId = contentHasErrors ? 'content-error' : undefined

	const isHydrated = useHydrated()

	useFocusInvalid(formRef.current, formHasErrors)

	console.log('state', state)

	const { register } = useForm<z.infer<typeof NoteEditorSchema>>({
		progressive: true,
		resolver: zodResolver(NoteEditorSchema),

		defaultValues: {
			id: note.id,
			title: note.title,
			content: note.content,
			images: note.images.length ? note.images : [{}],
			username: params.username,
		},
	})

	return (
		<form
			id={formId}
			noValidate={isHydrated}
			className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
			action={formAction}
			ref={formRef}
		>
			<div className="flex flex-col gap-1">
				<div>
					<Label htmlFor="note-title">Title</Label>
					<Input
						id="note-title"
						defaultValue={note.title}
						aria-invalid={titleHasErrors || undefined}
						aria-describedby={titleErrorId}
						{...register('title')}
					/>

					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList id={titleErrorId} errors={state?.fieldErrors.title} />
					</div>
				</div>
				<div>
					<Label htmlFor="note-content">Content</Label>
					<Textarea
						id="note-content"
						defaultValue={note.content}
						aria-invalid={contentHasErrors || undefined}
						aria-describedby={contentErrorId}
						{...register('content')}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={contentErrorId}
							errors={state?.fieldErrors?.content}
						/>
					</div>
				</div>

				<div>
					<Label>Image</Label>
					<ImageChooser image={note.images[0]} />
				</div>

				<div>
					<Label>Image</Label>
					<ImageChooser image={note.images[0]} />
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

			<ErrorList id={formErrorId} errors={state?.formErrors} />

			<input
				type="hidden"
				defaultValue={note.id}
				required
				{...register('id')}
			/>
			<input
				type="hidden"
				defaultValue={params.username}
				required
				{...register('username')}
			/>
		</form>
	)
}

function ImageChooser({
	image,
}: {
	image?: { id: string; altText?: string | null }
}) {
	const existingImage = Boolean(image)
	const [previewImage, setPreviewImage] = useState<string | null>(
		existingImage ? `/images/${image?.id}` : null,
	)
	const [altText, setAltText] = useState(image?.altText ?? '')

	return (
		<fieldset>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							htmlFor="image-input"
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-4': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									<img
										src={previewImage}
										alt={altText ?? ''}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									➕
								</div>
							)}
							{existingImage ? (
								<input name="imageId" type="hidden" value={image?.id} />
							) : null}
							<input
								id="image-input"
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={event => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								name="file"
								type="file"
								accept="image/*"
							/>
						</label>
					</div>
				</div>
				<div className="flex-1">
					<Label htmlFor="alt-text">Alt Text</Label>
					<Textarea
						id="alt-text"
						name="altText"
						defaultValue={altText}
						onChange={e => setAltText(e.currentTarget.value)}
					/>
				</div>
			</div>
		</fieldset>
	)
}

function ErrorList({
	id,
	errors,
}: {
	id?: string
	errors?: Array<string | undefined> | null
}) {
	return errors?.length ? (
		<ul id={id} className="flex flex-col gap-1">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null
}
