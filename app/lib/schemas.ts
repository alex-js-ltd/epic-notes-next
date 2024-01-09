import { z } from 'zod'

const titleMinLength = 1
const titleMaxLength = 100
const contentMinLength = 1
const contentMaxLength = 10000

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine(file => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
})

export const ImageFieldsetSchemaArray = z
	.array(ImageFieldsetSchema)
	.max(5)
	.optional()

export const NoteEditorSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
	images: ImageFieldsetSchemaArray,
})

export type Image = z.infer<typeof ImageFieldsetSchema>

export type Note = z.infer<typeof NoteEditorSchema>
