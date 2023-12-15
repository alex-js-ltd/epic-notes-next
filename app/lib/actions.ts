'use server'

import { db } from './db.server'
import { invariantResponse } from './misc'

export async function getUser({ params }: { params: { username: string } }) {
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
