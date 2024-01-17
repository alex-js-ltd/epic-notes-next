import { ReactNode } from 'react'
import { Spacer } from '@/app/comps/spacer'
import Link from 'next/link'

export default function EditUserProfile({ children }: { children: ReactNode }) {
	return (
		<div className="m-auto mb-24 mt-16 max-w-3xl">
			<div className="container">
				<ul className="flex gap-3">
					<li>
						<Link
							href=""
							className="text-muted-foreground"
							// href={`/users/${user.username}`}
						>
							Profile
						</Link>
					</li>
					{/* {breadcrumbs.map((breadcrumb, i, arr) => (
						<li
							key={i}
							className={cn('flex items-center gap-3', {
								'text-muted-foreground': i < arr.length - 1,
							})}
						>
							▶️ {breadcrumb}
						</li>
					))} */}
				</ul>
			</div>
			<Spacer size="xs" />
			<main className="mx-auto bg-muted px-6 py-8 md:container md:rounded-3xl">
				{children}
			</main>
		</div>
	)
}
