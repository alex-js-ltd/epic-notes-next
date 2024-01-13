import type { Metadata } from 'next'
import { Spacer } from '@/app/comps/spacer'
import OnboaringForm from './onboarding-form'
import { auth, currentUser } from '@clerk/nextjs'

export default function OnboaringRoute() {
	const user = auth()
	console.log(user)
	return (
		<div className="container flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-lg">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h1">Welcome aboard {user.userId}!</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs" />
				<OnboaringForm />
			</div>
		</div>
	)
}

export const metadata: Metadata = {
	title: 'Setup Epic Notes Account',
}
