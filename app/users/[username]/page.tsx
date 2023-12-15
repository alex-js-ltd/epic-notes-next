import Link from 'next/link'
import { db } from '@/app/lib/db.server'
import { invariantResponse } from '@/app/lib/misc'

type Props = { params: { username: string } }

async function getUser(props: Props) {
	const { params } = props

	const user = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return {
		user: { name: user.name, username: user.username },
	}
}

export default async function Page(props: Props) {
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
