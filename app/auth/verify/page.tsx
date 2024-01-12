import type { Metadata } from 'next'
import { Spacer } from '@/app/comps/spacer'
import VerifyForm from '@/app/comps/verify-form'

export default function VerifyRoute() {
	return (
		<div className="container flex flex-col justify-center pb-32 pt-20">
			<div className="text-center">
				<h1 className="text-h1">Check your email</h1>
				<p className="mt-3 text-body-md text-muted-foreground">
					We've sent you a code to verify your email address.
				</p>
			</div>

			<Spacer size="xs" />

			<div className="mx-auto flex w-72 max-w-full flex-col justify-center gap-1">
				<div className="flex w-full gap-2">
					<VerifyForm />
				</div>
			</div>
		</div>
	)
}

export const metadata: Metadata = {
	title: 'Setup Epic Notes Account',
}
