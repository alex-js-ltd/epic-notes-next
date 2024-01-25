import { test as base } from '@playwright/test'
import { createUser } from '../db-utils'
import { prisma } from '../../app/utils/db'
import invariant from 'tiny-invariant'

const test = base.extend<{
	insertNewUser(): Promise<{
		id: string
		name: string | null
		username: string | null
	}>
}>({
	insertNewUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async () => {
			const userData = createUser()
			const newUser = await prisma.user.create({
				select: { id: true, name: true, username: true },
				data: userData,
			})
			userId = newUser.id
			return newUser
		})
		await prisma.user.deleteMany({ where: { id: userId } })
	},
})
const { expect } = test

test('Search from home page', async ({ page, insertNewUser }) => {
	const { username } = await insertNewUser()
	invariant(typeof username === 'string', 'username does not exist')
	console.log(`test user ${username} added`)
	await page.goto('/')

	await page.getByRole('searchbox', { name: /search/i }).fill(username)
	await page.getByRole('button', { name: /search/i }).click()

	await page.waitForURL(`/users?${new URLSearchParams({ search: username })}`)
	await expect(page.getByText('Epic Notes Users')).toBeVisible()
	const userList = page.getByRole('main').getByRole('list')
	await expect(userList.getByRole('listitem')).toHaveCount(1)
	await expect(page.getByAltText(username)).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()
})
