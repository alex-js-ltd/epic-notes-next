import { createCookie } from '@remix-run/node'
import { CSRF } from 'remix-utils/csrf/server'
import { getEnv } from './env.server'

const { MODE, SESSION_SECRET } = getEnv()

const cookie = createCookie('csrf', {
	path: '/',
	httpOnly: true,
	secure: MODE === 'production',
	sameSite: 'lax',
	secrets: SESSION_SECRET.split(','),
})

export const csrf = new CSRF({ cookie })
