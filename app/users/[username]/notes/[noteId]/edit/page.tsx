import { loadNote, loadUser } from '@/app/utils/actions'
import EditForm from '@/app/comps/edit-form'

export default async function Page({
	params,
}: {
	params: { noteId: string; username: string }
}) {
	const noteData = await loadNote(params.noteId)

	const userData = await loadUser(params.username)

	return <EditForm note={noteData.note} user={userData.user} />
}
