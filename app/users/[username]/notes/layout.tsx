'use server'
import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import ActiveLink from '@/app/components/ui/active-link'
import { loadOwner } from '@/app/utils/actions'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import { Icon } from '@/app/components/ui/icon'

export default async function NotesLayout({
	params: { username },
	children,
}: PropsWithChildren<{
	params: { username: string }
}>) {
	const data = await loadOwner(username)
	const { userId } = auth()
	const isOwner = userId === data.owner.id
	const ownerDisplayName = data.owner.name
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'

	return (
		<main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
			<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<Link
							href={`/users/${data.owner.username}`}
							className="pb-4 pl-8 pr-4 pt-12"
						>
							<h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
								{ownerDisplayName}'s Notes
							</h1>
						</Link>
						<ul className="overflow-y-auto overflow-x-hidden pb-12">
							{isOwner ? (
								<li className="p-1 pr-0">
									<ActiveLink
										href={`/users/${data.owner.username}/notes/new`}
										className={navLinkDefaultClassName}
									>
										<Icon name="plus" />
									</ActiveLink>
								</li>
							) : null}
							{data.owner.notes.map(note => (
								<li key={note.id} className="p-1 pr-0">
									<ActiveLink
										href={`/users/${data.owner.username}/notes/${note.id}`}
										className={navLinkDefaultClassName}
									>
										{note.title}
									</ActiveLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="relative col-span-3 bg-accent md:rounded-r-3xl">
					{children}
				</div>
			</div>
		</main>
	)
}
