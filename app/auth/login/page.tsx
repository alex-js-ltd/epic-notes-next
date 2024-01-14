'use client'
import type { Metadata } from 'next'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { CheckboxField, ErrorList, Field } from '@/app/comps/forms'
import { Spacer } from '@/app/comps/spacer'
import { StatusButton } from '@/app/comps/ui/status-button'
import Link from 'next/link'
import { LoginFormSchema } from '@/app/utils/schemas'
import { useSignIn } from '@clerk/nextjs'

export default function LoginPage() {
	const { isLoaded, signIn, setActive } = useSignIn()

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getFieldsetConstraint(LoginFormSchema),
		defaultValue: { redirectTo: '' },

		onValidate({ formData }) {
			return parse(formData, { schema: LoginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	async function onSubmit(formData: FormData) {
		if (!isLoaded) return

		const submission = parse(formData, { schema: LoginFormSchema })

		if (!submission.value || submission.intent !== 'submit') {
			return submission
		}

		const { email, password } = submission.value

		await signIn
			.create({
				identifier: email,
				password,
			})
			.then(result => {
				if (result.status === 'complete') {
					console.log(result)
					setActive({ session: result.createdSessionId })
				} else {
					console.log(result)
				}
			})
			.catch(err => console.error('error', err.errors[0].longMessage))
	}

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h1">Welcome back!</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs" />

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<form {...form.props}>
							<HoneypotInputs />
							<Field
								labelProps={{ children: 'Email' }}
								inputProps={{
									...conform.input(fields.email),
									autoFocus: true,
									className: 'lowercase',
								}}
								errors={fields.email.errors}
							/>

							<Field
								labelProps={{ children: 'Password' }}
								inputProps={conform.input(fields.password, {
									type: 'password',
								})}
								errors={fields.password.errors}
							/>

							<div className="flex justify-between">
								<CheckboxField
									labelProps={{
										htmlFor: fields.remember.id,
										children: 'Remember me',
									}}
									buttonProps={conform.input(fields.remember, {
										type: 'checkbox',
									})}
									errors={fields.remember.errors}
								/>
								<div>
									<Link
										href="/auth/forgot-password"
										className="text-body-xs font-semibold"
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<input
								{...conform.input(fields.redirectTo, { type: 'hidden' })}
							/>
							<ErrorList errors={form.errors} id={form.errorId} />

							<div className="flex items-center justify-between gap-6 pt-3">
								<StatusButton className="w-full" type="submit">
									Log in
								</StatusButton>
							</div>
						</form>
						{/* <div className="mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3">
							<ProviderConnectionForm
								type="Login"
								providerName="github"
								redirectTo={redirectTo}
							/>
						</div> */}
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">New here?</span>
							<Link href="/auth/signup">Create an account</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// export const metadata: Metadata = {
// 	title: 'Login to Epic Notes',
// }
