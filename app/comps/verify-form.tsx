'use client'

import { StatusButton } from '@/app/comps/ui/status-button'
import { ErrorList } from '@/app/comps/error-list'
import { Label } from '@/app/comps/ui/label'
import { Input } from '@/app/comps/ui/input'
import { useSignUp } from '@clerk/nextjs'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { VerifySchema } from '@/app/utils/schemas'

export default function VerifyForm() {
	const { signUp, setActive } = useSignUp()
	const router = useRouter()
	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getFieldsetConstraint(VerifySchema),
		onValidate({ formData }) {
			return parse(formData, { schema: VerifySchema })
		},
		shouldRevalidate: 'onBlur',
		async onSubmit(event, { submission }) {
			event.preventDefault()

			if (!signUp) return

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
					router.push('/')
				}
			} catch (err: unknown) {
				console.error(JSON.stringify(err, null, 2))
			}
		},
	})

	return (
		<form className="flex-1" {...form.props}>
			<Label htmlFor={fields.code.id}>Code</Label>
			<Input autoFocus {...conform.input(fields.code)} />

			<div className="min-h-[32px] px-4 pb-3 pt-1">
				<ErrorList id={fields.code.errorId} errors={fields.code.errors} />
			</div>

			<StatusButton className="w-full" type="submit">
				Submit
			</StatusButton>
		</form>
	)
}
