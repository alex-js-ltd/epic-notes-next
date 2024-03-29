import type { Metadata } from 'next'
import SignUpForm from './signup-form'

export default function SignupRoute() {
	return (
		<div className="container flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-lg">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h1">Welcome aboard!</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>

				<SignUpForm />
			</div>
		</div>
	)
}

export const metadata: Metadata = {
	title: 'Setup Epic Notes Account',
}
