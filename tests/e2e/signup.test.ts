import { test, expect } from '@playwright/test'
import { createUser } from '../db-utils'

const userData = createUser()

const EMAIL = `${userData.name}+clerk_test@example.com`
const VERIFICATION_CODE = '424242'

test('Sign up user', async ({ page }) => {
	await page.goto('/auth/signup')

	await page.getByLabel('email').fill(EMAIL)
	await page.getByRole('button', { name: /create an account/i }).click()
	await page.goto(`/auth/verify`)
	await expect(page.getByText('Check your email')).toBeVisible()
	await expect(
		page.getByText(`We've sent you a code to verify your email address.`),
	).toBeVisible()
	await page.getByLabel('code').fill(VERIFICATION_CODE)
	await page.getByRole('button', { name: /submit/i }).click()
	await page.goto(`/auth/onboarding`)
	await expect(page.getByText(`Please enter your details.`)).toBeVisible()
})
