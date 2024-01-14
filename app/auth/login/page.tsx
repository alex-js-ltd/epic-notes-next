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

export default function LoginPage() {
	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getFieldsetConstraint(LoginFormSchema),
		defaultValue: { redirectTo: '' },

		onValidate({ formData }) {
			return parse(formData, { schema: LoginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

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
								labelProps={{ children: 'Username' }}
								inputProps={{
									...conform.input(fields.username),
									autoFocus: true,
									className: 'lowercase',
								}}
								errors={fields.username.errors}
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
