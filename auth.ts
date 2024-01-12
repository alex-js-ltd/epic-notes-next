import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { authConfig } from './auth.config'

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials)
				console.log(parsedCredentials)
				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data

					const user = { id: '123', name: 'kody', email, password: '123456' }

					return user
				}
			},
		}),
	],
})
