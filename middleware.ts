import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
	publicRoutes: ['/', '/auth/:path*', '/api/clerk'],
})

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
