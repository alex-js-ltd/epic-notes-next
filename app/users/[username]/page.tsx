import Link from 'next/link'
import { loadUser } from '@/app/utils/actions'
import { signout } from '@/app/utils/auth'
import { getUserImgSrc } from '@/app/utils/misc'
import { Spacer } from '@/app/comps/spacer'
import { getLoggedInUser } from '@/app/utils/auth'
import { Button } from '@/app/comps/ui/button'
import Icon from '@/app/comps/ui/_icon'
import { SignOutButton } from '@clerk/nextjs'

export default async function ProfileRoute({
	params: { username },
}: {
	params: { username: string }
}) {
	const data = await loadUser(username)
	const user = data.user
	const userDisplayName = user.name ?? user.username
	const loggedInUser = await getLoggedInUser()
	const isLoggedInUser = data.user.id === loggedInUser?.id

	return (
		<div className="container mb-48 mt-36 flex flex-col items-center justify-center">
			<Spacer size="4xs" />

			<div className="container flex flex-col items-center rounded-3xl bg-muted p-12">
				<div className="relative w-52">
					<div className="absolute -top-40">
						<div className="relative">
							<img
								src={getUserImgSrc(data.user.image?.id)}
								alt={userDisplayName ?? undefined}
								className="h-52 w-52 rounded-full object-cover"
							/>
						</div>
					</div>
				</div>

				<Spacer size="sm" />

				<div className="flex flex-col items-center">
					<div className="flex flex-wrap items-center justify-center gap-4">
						<h1 className="text-center text-h2">{userDisplayName}</h1>
					</div>
					<p className="mt-2 text-center text-muted-foreground">Joined {}</p>
					{isLoggedInUser ? (
						<form className="mt-3">
							<SignOutButton>
								<Button type="submit" variant="link" size="pill">
									<Icon name="exit" className="scale-125 max-md:scale-150">
										Logout
									</Icon>
								</Button>
							</SignOutButton>
						</form>
					) : null}
					<div className="mt-10 flex gap-4">
						{isLoggedInUser ? (
							<>
								<Button asChild>
									<Link href={`/users/${user.username}/notes`}>My notes</Link>
								</Button>
								<Button asChild>Edit profile</Button>
							</>
						) : (
							<Button asChild>
								<Link href={`/users/${user.username}/notes`}>
									{userDisplayName}'s notes
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
