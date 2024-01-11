import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getEnv } from '@/app/utils/env.server'

const { SESSION_SECRET } = getEnv()

export const authOptions: NextAuthOptions = {
	secret: SESSION_SECRET,

	providers: [
		CredentialsProvider({
			name: 'Guest',
			credentials: {},
			async authorize(credentials) {
				const user = {
					id: Math.random().toString(),
					name: 'Guest',
					email: 'guest@example.com',
				}
				return user
			},
		}),
	],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
