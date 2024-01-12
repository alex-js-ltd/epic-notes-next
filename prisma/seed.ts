import { faker } from '@faker-js/faker'
import { prisma } from '@/app/utils/db'
import {
	createPassword,
	createUser,
	getNoteImages,
	getUserImages,
} from '@/tests/db-utils'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	await prisma.verification.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const totalUsers = 3
	console.time(`👤 Created ${totalUsers} users...`)
	const noteImages = await getNoteImages()
	const userImages = await getUserImages()

	for (let index = 0; index < totalUsers; index++) {
		const userData = createUser()
		await prisma.user
			.create({
				select: { id: true },
				data: {
					...userData,
					password: { create: createPassword(userData.username) },
					image: { create: userImages[index % userImages.length] },

					notes: {
						create: Array.from({
							length: faker.number.int({ min: 2, max: 4 }),
						}).map(() => ({
							title: faker.lorem.sentence().slice(0, 20).trim(),
							content: faker.lorem.paragraphs(),
							images: {
								create: Array.from({
									length: faker.number.int({ min: 1, max: 3 }),
								}).map(() => {
									const imgNumber = faker.number.int({ min: 0, max: 9 })
									return noteImages[imgNumber]
								}),
							},
						})),
					},
				},
			})
			.catch(e => {
				console.error('Error creating a user:', e)
				return null
			})
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
