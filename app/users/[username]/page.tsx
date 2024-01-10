import Link from 'next/link'
import { loadUser } from '@/app/utils/actions'

export default async function Page({
	params: { username },
}: {
	params: { username: string }
}) {
	const data = await loadUser(username)

	return (
		<div className="container mb-48 mt-36">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link
				href={`/users/${username}/notes`}
				className="underline"
				prefetch={true}
			>
				Notes
			</Link>
		</div>
	)
}
