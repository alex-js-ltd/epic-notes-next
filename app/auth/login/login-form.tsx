'use client'

import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { CheckboxField, ErrorList, Field } from '@/app/comps/forms'
import { StatusButton } from '@/app/comps/ui/status-button'
import Link from 'next/link'
import { LoginFormSchema } from '@/app/utils/schemas'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
	const router = useRouter()
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

	async function action(formData: FormData) {
		if (!isLoaded) return

		const submission = parse(formData, { schema: LoginFormSchema })

		if (!submission.value || submission.intent !== 'submit') {
			return submission
		}

		const { email, password } = submission.value

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			})

			if (result.status === 'complete') {
				setActive({ session: result.createdSessionId })
				router.push('/')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<form {...form.props} action={action}>
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
						style={{ pointerEvents: 'none' }}
					>
						Forgot password?
					</Link>
				</div>
			</div>

			<input {...conform.input(fields.redirectTo, { type: 'hidden' })} />
			<ErrorList errors={form.errors} id={form.errorId} />

			<div className="flex items-center justify-between gap-6 pt-3">
				<StatusButton className="w-full" type="submit">
					Log in
				</StatusButton>
			</div>
		</form>
	)
}
