import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import ActiveLink from '@/app/comps/ui/active-link'
import { db } from '@/app/lib/db.server'
import { invariantResponse } from '@/app/lib/misc'

type Props = { params: { username: string } }

async function loadOwner({ params }: Props) {
	'use server'

	const owner = db.user.findFirst({
		where: {
			username: {
				equals: params.username,
			},
		},
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return { owner }
}

async function loadNotes({ params }: Props) {
	'use server'

	const notes = db.note
		.findMany({
			where: {
				owner: {
					username: {
						equals: params.username,
					},
				},
			},
		})
		.map(({ id, title }) => ({ id, title }))

	invariantResponse(notes, 'Notes not found', { status: 404 })

	return { notes }
}

export default async function NotesLayout(props: PropsWithChildren<Props>) {
	const ownerPromise = loadOwner(props)
	const notesPromise = loadNotes(props)

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
					{props.children}
				</div>
			</div>
		</main>
	)
}
