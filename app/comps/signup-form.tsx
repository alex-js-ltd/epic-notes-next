'use client'

import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Button } from '@/app/comps/ui/button'
import { HoneypotInputs } from '@/app/comps/honeypot'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { SignupSchema } from '@/app/utils/schemas'
import { useSignUp } from '@clerk/nextjs'
import invariant from 'tiny-invariant'

export default function SignupForm() {
	const { signUp, setActive } = useSignUp()

	const [form, fields] = useForm({
		id: 'sign-up-form',
		constraint: getFieldsetConstraint(SignupSchema),
		onValidate({ formData }) {
			return parse(formData, { schema: SignupSchema })
		},

		async onSubmit(event, { submission }) {
			event.preventDefault()

			if (!signUp) return

			const { email, password } = submission.value

			invariant(typeof email === 'string')
			invariant(typeof password === 'string')

			await signUp
				.create({
					emailAddress: email,
					password: password,
				})
				.then(async response => {
					const completeSignUp =
						await response.prepareEmailAddressVerification()

					if (completeSignUp.status === 'complete') {
						await setActive({ session: completeSignUp.createdSessionId })
					}

					return response
				})
		},
	})

	return (
		<form
			className="mx-auto flex min-w-[368px] max-w-sm flex-col gap-4"
			{...form.props}
		>
			<HoneypotInputs />
			<div>
				<Label htmlFor={fields.email.id}>Email</Label>
				<Input autoFocus {...conform.input(fields.email)} />
			</div>

			<div>
				<Label htmlFor={fields.password.id}>Password</Label>
				<Input type="password" {...conform.input(fields.password)} />
			</div>
			<Button className="w-full" type="submit">
				Create an account
			</Button>
		</form>
	)
}
