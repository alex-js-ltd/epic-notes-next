import { loadNote } from '@/app/lib/actions'
import EditForm from '@/app/comps/edit-form'

export default async function Page({
	params,
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(params.noteId)

	return <EditForm {...getEditFormProps(data, params)} />
}

function getEditFormProps(
	data: { note: { title: string; content: string } },
	params: { noteId: string; username: string },
) {
	return { ...data.note, ...params }
}
