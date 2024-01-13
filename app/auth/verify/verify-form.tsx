'use client'

import { Field } from '@/app/comps/forms'
import { StatusButton } from '@/app/comps/ui/status-button'
import { useSignUp } from '@clerk/nextjs'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { VerifySchema } from '@/app/utils/schemas'
import { useRouter } from 'next/navigation'

export default function VerifyForm() {
	const router = useRouter()
	const { signUp, setActive } = useSignUp()

	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getFieldsetConstraint(VerifySchema),
		onValidate({ formData }) {
			return parse(formData, { schema: VerifySchema })
		},
		shouldRevalidate: 'onBlur',
		onSubmit(event, { submission }) {
			// event.preventDefault()
		},
	})

	async function action(formData: FormData) {
		if (!signUp) return

		const submission = parse(formData, { schema: VerifySchema })

		if (!submission.value || submission.intent !== 'submit') {
			return submission
		}

		const { code } = submission.value

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			})
			if (completeSignUp.status !== 'complete') {
				/*  investigate the response, to see if there was an error
                   or if the user needs to complete more steps.*/
				console.log(JSON.stringify(completeSignUp, null, 2))
			}
			if (completeSignUp.status === 'complete') {
				await setActive({ session: completeSignUp.createdSessionId })
				router.push('/auth/onboarding')
			}
		} catch (err: unknown) {
			console.error(JSON.stringify(err, null, 2))
		}
	}
	return (
		<form className="flex-1" {...form.props} action={action}>
			<Field
				labelProps={{
					htmlFor: fields.code.id,
					children: 'Code',
				}}
				inputProps={{ ...conform.input(fields.code), autoFocus: true }}
				errors={fields.code.errors}
			/>

			<StatusButton className="w-full" type="submit">
				Submit
			</StatusButton>
		</form>
	)
}
