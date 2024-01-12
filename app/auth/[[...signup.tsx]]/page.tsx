import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Button } from '@/app/comps/ui/button'
import { SignUp } from '@/app/utils/actions'
import type { Metadata } from 'next'
import { HoneypotInputs } from '@/app/comps/honeypot'

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
				<form
					className="mx-auto flex min-w-[368px] max-w-sm flex-col gap-4"
					action={SignUp}
				>
					<HoneypotInputs />
					<div>
						<Label htmlFor="email-input">Email</Label>
						<Input autoFocus id="email-input" name="email" type="email" />
					</div>

					<div>
						<Label htmlFor="password-input">Password</Label>
						<Input
							autoFocus
							id="password-input"
							name="password"
							type="password"
							value="123456"
						/>
					</div>
					<Button className="w-full" type="submit">
						Create an account
					</Button>
				</form>
			</div>
		</div>
	)
}

export const metadata: Metadata = {
	title: 'Setup Epic Notes Account',
}
