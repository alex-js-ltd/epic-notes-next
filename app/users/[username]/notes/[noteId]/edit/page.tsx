import { loadNote } from '@/app/lib/actions'
import EditForm from '@/app/comps/edit-form'

export default async function Page({
	params: { username, noteId },
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(noteId)

	const props: React.ComponentProps<typeof EditForm> = {
		note: { ...data.note },
		user: { username },
	}

	return <EditForm {...props} />
}
