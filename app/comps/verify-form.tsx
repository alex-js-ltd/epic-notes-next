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
import { Spacer } from './spacer'

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
			}
		} catch (err: unknown) {
			console.error(JSON.stringify(err, null, 2))
		}
	}
	return (
		<div className="container flex flex-col justify-center pb-32 pt-20">
			<div className="text-center">
				<h1 className="text-h1">Check your email</h1>
				<p className="mt-3 text-body-md text-muted-foreground">
					We've sent you a code to verify your email address.
				</p>
			</div>

			<Spacer size="xs" />

			<div className="mx-auto flex w-72 max-w-full flex-col justify-center gap-1">
				<div className="flex w-full gap-2">
					<form className="flex-1" {...form.props} action={action}>
						<Label htmlFor={fields.code.id}>Code</Label>
						<Input autoFocus {...conform.input(fields.code)} />

						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList id={fields.code.errorId} errors={fields.code.errors} />
						</div>

						<StatusButton className="w-full" type="submit">
							Submit
						</StatusButton>
					</form>
				</div>
			</div>
		</div>
	)
}
