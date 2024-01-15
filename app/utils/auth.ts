'use server'

import { type User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs'
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

	invariant(username, 'no username')

	const updateClerk = await clerkClient.users.updateUser(id, {
		password,
		username,
	})

	return updateUser
}

export async function getUser() {
	const { userId } = auth()
	const user = userId
		? await prisma.user.findUniqueOrThrow({
				select: {
					id: true,
					name: true,
					username: true,
					image: { select: { id: true } },
				},
				where: { id: userId },
		  })
		: null

	return user
}
