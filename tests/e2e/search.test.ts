import { expect, test } from '@playwright/test'
import { createUser } from '../db-utils'
import { prisma } from '../../app/utils/db'

test('Search from home page', async ({ page }) => {
	const userData = createUser()
	const newUser = await prisma.user.create({
		select: { id: true, name: true, username: true },
		data: userData,
	})
	console.log(`test user ${newUser.username} added`)
	await page.goto('/')

	await page.getByRole('searchbox', { name: /search/i }).fill(userData.username)
	await page.getByRole('button', { name: /search/i }).click()

	await page.waitForURL(
		`/users?${new URLSearchParams({ search: userData.username })}`,
	)
	await expect(page.getByText('Epic Notes Users')).toBeVisible()
	const userList = page.getByRole('main').getByRole('list')
	await expect(userList.getByRole('listitem')).toHaveCount(1)
	await expect(page.getByAltText(userData.username)).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()
	await prisma.user.delete({ where: { id: newUser.id } })
	console.log(`test user ${newUser.username} removed`)
})
