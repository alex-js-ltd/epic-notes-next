import Link from 'next/link'
import { getUser } from '@/app/lib/actions'

export default async function Page(props: { params: { username: string } }) {
	const data = await getUser(props)

	return (
		<div className="container mb-48 mt-36">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link href="notes" className="underline" prefetch={true}>
				Notes
			</Link>
		</div>
	)
}
