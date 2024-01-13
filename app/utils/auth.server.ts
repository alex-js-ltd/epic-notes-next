import { type Password, type User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { auth, currentUser } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function signup({
	username,
	password,
	name,
}: {
	username: User['username']
	name: User['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	const { userId } = auth()
	console.log(userId)
	invariant(userId)
	const updateUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			name,
			username,
			password: {
				upsert: {
					create: {
						hash: hashedPassword,
					},
					update: {
						hash: hashedPassword,
					},
				},
			},
		},
	})

	return updateUser
}
