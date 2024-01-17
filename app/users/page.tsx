'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { ErrorList } from '@/app/comps/forms'
import { cn, getUserImgSrc } from '@/app/utils/misc'
import Link from 'next/link'

import { searchUsers } from '@/app/utils/actions'
import { SearchBar } from '../comps/search-bar'

export default function UsersRoute() {
	const [data, dispatch] = useFormState(searchUsers, null)

	return (
		<div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
			<h1 className="text-h1">Epic Notes Users</h1>
			<div className="w-full max-w-[700px] ">
				<SearchBar autoFocus autoSubmit={true} action={dispatch} />
			</div>

			<main>
				{data?.status === 'idle' ? (
					data.users && data?.users.length ? (
						<ul className="flex w-full flex-wrap items-center justify-center gap-4 delay-200">
							{data.users.map(user => (
								<li key={user.id}>
									<Link
										href={`/users/${user.username}`}
										className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
									>
										<img
											alt={user.name ?? user.username}
											src={getUserImgSrc(user.imageId)}
											className="h-16 w-16 rounded-full"
										/>
										{user.name ? (
											<span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
												{user.name}
											</span>
										) : null}
										<span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
											{user.username}
										</span>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>No users found</p>
					)
				) : data?.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the results']} />
				) : null}
			</main>
		</div>
	)
}

function IsFetching({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus()

	return <div className={cn({ 'opacity-50': pending })}>{children}</div>
}
