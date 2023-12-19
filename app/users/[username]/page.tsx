import Link from 'next/link'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'

type Props = { params: { username: string } }

async function loadUser({ params }: Props) {
	'use server'

	const user = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})

	invariant(user, `No user with the username ${params.username} exists`)

	return {
		user: { name: user.name, username: user.username },
	}
}

export default async function Page(props: Props) {
	const data = await loadUser(props)

	return (
		<div className="container mb-48 mt-36">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link href="notes" className="underline" prefetch={true}>
				Notes
			</Link>
		</div>
	)
}
