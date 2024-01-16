import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Nunito_Sans } from 'next/font/google'
import { cn, getUserImgSrc } from './utils/misc'
import { loadUserInfo } from './utils/actions'
import { getLoggedInUser } from './utils/auth'
import { HoneypotProvider } from './comps/honeypot'
import { ClerkProvider } from '@clerk/nextjs'
import { Button } from './comps/ui/button'
import { SearchBar } from './comps/search-bar'
import './globals.css'

const nunito = Nunito_Sans({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
})

async function RootLayout({ children }: { children: ReactNode }) {
	const user = await getLoggedInUser()

	return (
		<html
			lang="en"
			className={cn('h-full overflow-x-hidden', nunito.className)}
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
			</head>
			<body className="flex h-full flex-col justify-between bg-background text-foreground">
				<header className="container mx-auhref py-6">
					<nav className="flex items-center justify-between gap-4 sm:gap-6">
						<Link href="/">
							<div className="font-light">epic</div>
							<div className="font-bold">notes</div>
						</Link>

						<div className="ml-auto max-w-sm flex-1">
							<SearchBar status="idle" />
						</div>

						<div className="flex items-center gap-10">
							{user ? (
								<div className="flex items-center gap-2">
									<Button asChild variant="secondary">
										<Link
											href={`/users/${user?.username}`}
											className="flex items-center gap-2"
										>
											<img
												className="h-8 w-8 rounded-full object-cover"
												alt={user.name ?? undefined}
												src={getUserImgSrc(user.image?.id)}
											/>
											<span className="hidden text-body-sm font-bold sm:block">
												{user.name ?? user.username}
											</span>
										</Link>
									</Button>
								</div>
							) : (
								<Button asChild variant="default" size="sm">
									<Link href="/auth/login">Log In</Link>
								</Button>
							)}
						</div>
					</nav>
				</header>

				<div className="flex-1">{children}</div>

				<div className="container mx-auhref flex justify-between">
					<Link href="/">
						<div className="font-light">epic</div>
						<div className="font-bold">notes</div>
					</Link>
					<p>Built with ♥️ by alex</p>
				</div>
				<div className="h-5" />
			</body>
		</html>
	)
}

export default async function AppWithProviders({
	children,
}: {
	children: ReactNode
}) {
	const data = await loadUserInfo()

	return (
		<ClerkProvider>
			<HoneypotProvider {...data.honeyProps}>
				<RootLayout>{children}</RootLayout>
			</HoneypotProvider>
		</ClerkProvider>
	)
}

export const metadata: Metadata = {
	title: 'Epic Notes',
	description: "Your own captain's log",

	icons: {
		icon: '/icon.svg',
	},
}
