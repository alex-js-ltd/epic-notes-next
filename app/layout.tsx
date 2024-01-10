import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Nunito_Sans } from 'next/font/google'
import { cn } from './utils/misc'
import { loadUserInfo } from './utils/actions'
import { HoneypotProvider } from './comps/honeypot'

import './globals.css'

const nunito = Nunito_Sans({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
})

async function RootLayout({ children }: { children: ReactNode }) {
	const data = await loadUserInfo()

	const res = await fetch('http://localhost:3000/api/csrf')

	console.log(res)
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
					<nav className="flex justify-between">
						<Link href="/">
							<div className="font-light">epic</div>
							<div className="font-bold">notes</div>
						</Link>
						<Link className="underline" href="/users/kody/notes/d27a197e">
							Kody's Notes
						</Link>
					</nav>
				</header>

				<div className="flex-1">{children}</div>

				<div className="container mx-auhref flex justify-between">
					<Link href="/">
						<div className="font-light">epic</div>
						<div className="font-bold">notes</div>
					</Link>
					<p>Built with ♥️ by {data.username}</p>
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
		<HoneypotProvider {...data.honeyProps}>
			<RootLayout>{children}</RootLayout>
		</HoneypotProvider>
	)
}

export const metadata: Metadata = {
	title: 'Epic Notes',
	description: "Your own captain's log",

	icons: {
		icon: '/icon.svg',
	},
}
