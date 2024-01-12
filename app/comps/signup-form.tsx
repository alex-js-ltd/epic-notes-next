'use client'

import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { Button } from '@/app/comps/ui/button'
import { HoneypotInputs } from '@/app/comps/honeypot'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { SignupSchema } from '@/app/utils/schemas'
import { useSignUp } from '@clerk/nextjs'
import { ErrorList } from './error-list'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
	const { signUp } = useSignUp()

	const router = useRouter()

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getFieldsetConstraint(SignupSchema),
		onValidate({ formData }) {
			return parse(formData, { schema: SignupSchema })
		},
		shouldRevalidate: 'onBlur',
		onSubmit(event, { submission }) {
			// event.preventDefault()
		},
	})

	async function action(formData: FormData) {
		if (!signUp) return

		const submission = parse(formData, { schema: SignupSchema })

		if (!submission.value || submission.intent !== 'submit') {
			return submission
		}

		const { email } = submission.value

		try {
			await signUp.create({
				emailAddress: email,
			})

			// send the email.
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
			router.push('/auth/verify')
		} catch (err: unknown) {
			console.error(JSON.stringify(err, null, 2))
		}
	}

	return (
		<form
			className="mx-auto flex min-w-[368px] max-w-sm flex-col gap-4"
			{...form.props}
			action={action}
		>
			<HoneypotInputs />
			<div>
				<Label htmlFor={fields.email.id}>Email</Label>
				<Input autoFocus {...conform.input(fields.email)} />

				<div className="min-h-[32px] px-4 pb-3 pt-1">
					<ErrorList id={fields.email.errorId} errors={fields.email.errors} />
				</div>
			</div>

			<Button className="w-full" type="submit">
				Create an account
			</Button>
		</form>
	)
}
