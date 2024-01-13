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
	id,
	username,
	password,
	name,
}: {
	id: User['id']
	username: User['username']
	name: User['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	const updateUser = await prisma.user.update({
		where: {
			id,
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
