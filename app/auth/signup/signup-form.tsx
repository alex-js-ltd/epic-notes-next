'use client'

import { Field } from '@/app/components/forms'
import { Button } from '@/app/components/ui/button'
import { HoneypotInputs } from '@/app/components/honeypot'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { SignupSchema } from '@/app/utils/schemas'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
	const router = useRouter()
	const { signUp } = useSignUp()

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

			<Field
				labelProps={{
					htmlFor: fields.email.id,
					children: 'Email',
				}}
				inputProps={{ ...conform.input(fields.email), autoFocus: true }}
				errors={fields.email.errors}
			/>

			<Button className="w-full" type="submit">
				Create an account
			</Button>
		</form>
	)
}
