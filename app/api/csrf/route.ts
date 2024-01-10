import { createCookie } from '@remix-run/node'
import { CSRF } from 'remix-utils/csrf/server'
import { getEnv } from '@/app/utils/env.server'
const { MODE, SESSION_SECRET } = getEnv()

const cookie = createCookie('csrf', {
	path: '/',
	httpOnly: true,
	secure: MODE === 'production',
	sameSite: 'lax',
	secrets: SESSION_SECRET.split(','),
})

export const csrf = new CSRF({ cookie })

export async function GET(request: Request) {
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)

	return new Response('Hello, Next.js!', {
		status: 200,
		headers: csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : {},
	})
}
