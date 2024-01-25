import { test } from '@playwright/test'
import { createUser } from '../db-utils'

const EMAIL = 'jane+clerk_test@example.com'
const VERIFICATION_CODE = 424242

test('Sign up user', async ({ page }) => {
	await page.goto('/auth/signup')

	await page.getByLabel('email').fill(EMAIL)
	await page.getByRole('button', { name: /create an account/i }).click()
	await page.goto(`/auth/verify`)
})
