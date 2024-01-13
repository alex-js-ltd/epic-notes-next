'use client'

import { Field, CheckboxField, ErrorList } from '@/app/comps/forms'
import { StatusButton } from '@/app/comps/ui/status-button'
import { HoneypotInputs } from '@/app/comps/honeypot'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { OnboardingFormSchema } from '@/app/utils/schemas'
import { onBoardUser } from '@/app/utils/actions'

export default function OnboaringForm() {
	const [form, fields] = useForm({
		id: 'onboarding-form',
		constraint: getFieldsetConstraint(OnboardingFormSchema),
		defaultValue: { redirectTo: '' },

		onValidate({ formData }) {
			return parse(formData, { schema: OnboardingFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<form
			className="mx-auto min-w-[368px] max-w-sm"
			{...form.props}
			action={onBoardUser}
		>
			<HoneypotInputs />
			<Field
				labelProps={{ htmlFor: fields.username.id, children: 'Username' }}
				inputProps={{
					...conform.input(fields.username),
					autoComplete: 'username',
					className: 'lowercase',
				}}
				errors={fields.username.errors}
			/>
			<Field
				labelProps={{ htmlFor: fields.name.id, children: 'Name' }}
				inputProps={{
					...conform.input(fields.name),
					autoComplete: 'name',
				}}
				errors={fields.name.errors}
			/>
			<Field
				labelProps={{ htmlFor: fields.password.id, children: 'Password' }}
				inputProps={{
					...conform.input(fields.password, { type: 'password' }),
					autoComplete: 'new-password',
				}}
				errors={fields.password.errors}
			/>

			<Field
				labelProps={{
					htmlFor: fields.confirmPassword.id,
					children: 'Confirm Password',
				}}
				inputProps={{
					...conform.input(fields.confirmPassword, { type: 'password' }),
					autoComplete: 'new-password',
				}}
				errors={fields.confirmPassword.errors}
			/>

			<CheckboxField
				labelProps={{
					htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
					children: 'Do you agree to our Terms of Service and Privacy Policy?',
				}}
				buttonProps={conform.input(
					fields.agreeToTermsOfServiceAndPrivacyPolicy,
					{ type: 'checkbox' },
				)}
				errors={fields.agreeToTermsOfServiceAndPrivacyPolicy.errors}
			/>
			<CheckboxField
				labelProps={{
					htmlFor: fields.remember.id,
					children: 'Remember me',
				}}
				buttonProps={conform.input(fields.remember, { type: 'checkbox' })}
				errors={fields.remember.errors}
			/>

			<input {...conform.input(fields.redirectTo, { type: 'hidden' })} />
			<ErrorList errors={form.errors} id={form.errorId} />

			<div className="flex items-center justify-between gap-6">
				<StatusButton className="w-full" type="submit">
					Create an account
				</StatusButton>
			</div>
		</form>
	)
}
