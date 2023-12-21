import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import ActiveLink from '@/app/comps/ui/active-link'
import { db } from '@/app/lib/db.server'
import invariant from 'tiny-invariant'

export async function loadOwner(username: string) {
	'use server'
	const owner = db.user.findFirst({
		where: {
			username: {
				equals: username,
			},
		},
	})

	invariant(owner, `No owener withe the name ${username} found`)

	return {
		owner: { name: owner.name, username: owner.username },
	}
}

export async function loadNotes(username: string) {
	'use server'
	const notes = db.note
		.findMany({
			where: {
				owner: {
					username: {
						equals: username,
					},
				},
			},
		})
		.map(({ id, title }) => ({ id, title }))

	invariant(notes, `Notes not found`)

	return { notes }
}

export default async function NotesLayout({
	params: { username },
	children,
}: PropsWithChildren<{
	params: { username: string }
}>) {
	const ownerPromise = loadOwner(username)
	const notesPromise = loadNotes(username)

	const [ownerData, notesData] = await Promise.all([ownerPromise, notesPromise])

	const ownerDisplayName = ownerData.owner.name ?? ownerData.owner.username
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'

	return (
		<main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
			<div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<Link href=".." className="pb-4 pl-8 pr-4 pt-12">
							<h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
								{ownerDisplayName}'s Notes
							</h1>
						</Link>
						<ul className="overflow-y-auto overflow-x-hidden pb-12">
							{notesData.notes.map(note => (
								<li key={note.id} className="p-1 pr-0">
									<ActiveLink
										href={`/users/${ownerDisplayName.toLowerCase()}/notes/${
											note.id
										}`}
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
