import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
	publicRoutes: ['/:path*', '/api/clerk'],
})

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
