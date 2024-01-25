import { expect, test } from '@playwright/test'

test('Search from home page', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('searchbox', { name: /search/i }).fill('alex')
	await page.getByRole('button', { name: /search/i }).click()

	await page.waitForURL(`/users?search=alex`)
	await expect(page.getByText('Epic Notes Users')).toBeVisible()
	const userList = page.getByRole('main').getByRole('list')
	await expect(userList.getByRole('listitem')).toHaveCount(1)
	await expect(page.getByAltText('alex')).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()
})
