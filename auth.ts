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
					.object({ email: z.string().email() })
					.safeParse(credentials)

				console.log(parsedCredentials)
				if (parsedCredentials.success) {
					const { email } = parsedCredentials.data

					return { id: '123456', name: email, email, password: '123456' }
					//   const user = await getUser(email);
					//   if (!user) return null;

					//   const passwordsMatch = await bcrypt.compare(password, user.password);
					//   if (passwordsMatch) return user;
				}

				console.log('Invalid credentials')
				return null
			},
		}),
	],
})
