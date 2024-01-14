import { loadNote } from '@/app/utils/actions'
import NoteEditor from '@/app/components/note-editor'

export default async function Page({
	params,
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(params.noteId)

	return <NoteEditor note={data.note} />
}
