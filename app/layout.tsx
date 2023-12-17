import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import os from 'node:os'
import Link from 'next/link'
import { Nunito_Sans } from 'next/font/google'

import './globals.css'

export const nunito = Nunito_Sans({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
})

async function loader() {
	'use server'
	return { username: os.userInfo().username }
}

export default async function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const data = await loader()

	return (
		<html lang="en" className={'h-full overflow-x-hidden'}>
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

export const metadata: Metadata = {
	title: 'Epic Notes',
	description: "Your own captain's log",
}
