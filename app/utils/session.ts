import { SessionOptions } from 'iron-session'
import { getEnv } from './env.server'

const { SESSION_SECRET, MODE } = getEnv()

export interface SessionData {
	username: string
	isLoggedIn: boolean
}

export const defaultSession: SessionData = {
	username: '',
	isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
	password: SESSION_SECRET,
	cookieName: 'token',
	cookieOptions: {
		path: '/',
		httpOnly: true,
		secure: MODE === 'production',
		sameSite: 'lax',
	},
}

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
