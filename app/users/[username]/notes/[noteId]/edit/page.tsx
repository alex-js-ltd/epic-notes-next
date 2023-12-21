import { loadNote } from '@/app/lib/actions'
import EditForm from '@/app/comps/edit-form'

export default async function Page({
	params,
}: {
	params: { noteId: string; username: string }
}) {
	const data = await loadNote(params.noteId)

	const props: React.ComponentProps<typeof EditForm> = {
		...data.note,
		...params,
	}

	return <EditForm {...props} />
}
