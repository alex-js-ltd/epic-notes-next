import type { NextAuthConfig } from 'next-auth'
import { getEnv } from './app/utils/env.server'

const { SESSION_SECRET } = getEnv()

export const authConfig = {
	secret: SESSION_SECRET,
	pages: {
		signIn: '/auth/signup',
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user

			console.log('is logged in', isLoggedIn)
			const isOnDashboard = nextUrl.pathname.startsWith('/users')
			if (isOnDashboard) {
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			} else if (isLoggedIn) {
				return Response.redirect(new URL(`/users/${auth?.user?.name}`, nextUrl))
			}
			return true
		},
	},
} satisfies NextAuthConfig
