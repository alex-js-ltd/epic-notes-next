import { loadNote, loadUser } from '@/app/utils/actions'
import EditForm from '@/app/comps/edit-form'

export default async function Page({
	params,
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(params.noteId)

	return <EditForm note={data.note} />
}
