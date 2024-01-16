'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { ErrorList } from '@/app/comps/forms'
import { cn, getUserImgSrc } from '@/app/utils/misc'
import Link from 'next/link'

import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { StatusButton } from '@/app/comps/ui/status-button'
import { Icon } from '@/app/comps/ui/_icon'
import { searchUsers } from '@/app/utils/actions'

export default function UsersRoute() {
	const [data, dispatch] = useFormState(searchUsers, null)

	return (
		<form
			className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6"
			action={dispatch}
		>
			<h1 className="text-h1">Epic Notes Users</h1>

			<div className="w-full max-w-[700px] ">
				<div className="flex flex-wrap items-center justify-center gap-2">
					<div className="flex-1">
						<Label htmlFor="search-id" className="sr-only">
							Search
						</Label>
						<Input
							type="search"
							name="search"
							id="search-id"
							placeholder="Search"
							className="w-full"
							autoFocus
						/>
					</div>
					<div>
						<StatusButton
							type="submit"
							className="flex w-full items-center justify-center"
							size="sm"
						>
							<Icon name="magnifying-glass" size="sm" />
							<span className="sr-only">Search</span>
						</StatusButton>
					</div>
				</div>
			</div>
			<main>
				{data?.status === 'idle' ? (
					data.users && data?.users.length ? (
						<IsFetching>
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
						</IsFetching>
					) : (
						<p>No users found</p>
					)
				) : data?.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the results']} />
				) : null}
			</main>
		</form>
	)
}

function IsFetching({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus()

	return <div className={cn({ 'opacity-50': pending })}>{children}</div>
}
