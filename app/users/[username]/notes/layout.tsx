import type { PropsWithChildren } from 'react'
import Link from 'next/link'
import ActiveLink from '@/app/comps/ui/active-link'
import { loadOwner } from '@/app/utils/actions'
import { auth } from '@clerk/nextjs'
import { cn } from '@/app/utils/misc'

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
						<Link href=".." className="pb-4 pl-8 pr-4 pt-12">
							<h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
								{ownerDisplayName}'s Notes
							</h1>
						</Link>
						<ul className="overflow-y-auto overflow-x-hidden pb-12">
							{isOwner ? (
								<li className="p-1 pr-0">
									<ActiveLink
										href={`/users/${data.owner.username}/notes/new`}
										className={cn(navLinkDefaultClassName, 'flex items-center')}
									>
										<svg
											className="w-6 h-6 text-currentColor"
											viewBox="0 0 15 15"
											fill="none"
											id="plus"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
												fill="currentColor"
											></path>
										</svg>
										New Note
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
