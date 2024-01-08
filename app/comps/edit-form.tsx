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
import { useFocusInvalid, useHydrated } from '@/app/lib/hooks'
import { cn } from '@/app/lib/misc'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NoteEditorSchema } from '@/app/lib/schemas'

import type { Note, Image } from '@/app/lib/schemas'

type State = ReturnType<typeof editNote>

const initialState = {
	fieldErrors: {},
	formErrors: [],
}

export default function EditForm({ note }: { note: Note }) {
	const formId = 'note-editor'

	const formRef = useRef<HTMLFormElement>(null)

	const params = useParams<{ noteId: string; username: string }>()

	const isHydrated = useHydrated()

	const [{ fieldErrors, formErrors }, formAction] = useFormState<
		State,
		FormData
	>(editNote, initialState)

	const { register, control } = useForm<Note>({
		progressive: true,
		resolver: zodResolver(NoteEditorSchema),

		defaultValues: {
			id: note.id,
			title: note.title,
			content: note.content,
			images: note.images?.length ? note.images : [{}],
		},
	})

	const {
		fields: imageList,
		append,
		remove,
	} = useFieldArray({
		control,
		name: 'images',
		keyName: 'key',
	})

	/**
	 * Get form errors from useFormState.
	 * This improves progressive enhancement.
	 */

	const formHasErrors = Boolean(formErrors?.length)
	const formErrorId = formHasErrors ? 'form-error' : undefined
	const titleHasErrors = Boolean(fieldErrors?.title?.length)
	const titleErrorId = titleHasErrors ? 'title-error' : undefined
	const contentHasErrors = Boolean(fieldErrors?.content?.length)
	const contentErrorId = contentHasErrors ? 'content-error' : undefined

	useFocusInvalid(formRef.current, formHasErrors)

	return (
		<div className="absolute inset-0">
			<form
				id={formId}
				noValidate={isHydrated}
				className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
				action={formAction}
				ref={formRef}
			>
				{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
				<button type="submit" className="hidden" />
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
							<ErrorList id={titleErrorId} errors={fieldErrors.title} />
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
							<ErrorList id={contentErrorId} errors={fieldErrors?.content} />
						</div>
					</div>

					<div>
						<Label>Images</Label>
						<ul className="flex flex-col gap-4">
							{imageList.map((image, index) => (
								<li
									key={image.key}
									className="relative border-b-2 border-muted-foreground"
								>
									<button
										className="text-foreground-destructive absolute right-0 top-0"
										onClick={() => remove(index)}
									>
										<span aria-hidden>❌</span>{' '}
										<span className="sr-only">Remove image {index + 1}</span>
									</button>
									<ImageChooser image={image} />
								</li>
							))}
						</ul>
					</div>

					<Button type="button" className="mt-3" onClick={() => append({})}>
						<span aria-hidden>➕ Image</span>{' '}
						<span className="sr-only">Add image</span>
					</Button>
				</div>
				<ErrorList id={formErrorId} errors={formErrors} />
				<input type="hidden" defaultValue={note.id} {...register('id')} />
				<input type="hidden" name="username" defaultValue={params.username} />
			</form>
			<div className={floatingToolbarClassName}>
				<Button form={formId} variant="destructive" type="reset">
					Reset
				</Button>
				<StatusButton form={formId} type="submit">
					Submit
				</StatusButton>
			</div>
		</div>
	)
}

function ImageChooser({ image }: { image?: Image }) {
	const existingImage = Boolean(image?.id)
	const [previewImage, setPreviewImage] = useState<string | null>(
		existingImage ? `/api/images/${image?.id}` : null,
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
							{previewImage ? (
								<input name="imageId" type="hidden" value={image?.id} />
							) : null}
							<input
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
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						{/* <ErrorList id={fields.file.errorId} errors={state?.} /> */}
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
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						{/* <ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/> */}
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				{/* <ErrorList id={config.errorId} errors={config.errors} /> */}
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
