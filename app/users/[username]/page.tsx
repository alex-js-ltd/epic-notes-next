import Link from 'next/link'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'

export async function loadUser(username: string) {
	'use-server'

	const user = db.user.findFirst({
		where: {
			username: {
				equals: username,
			},
		},
	})

	invariant(user, `No user with the username ${username} exists`)

	return {
		user: { name: user.name, username: user.username },
	}
}

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
