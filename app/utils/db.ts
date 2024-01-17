import { PrismaClient } from '@prisma/client'
import { getEnv } from './env.server'

const { MODE } = getEnv()

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query'],
	})

if (MODE !== 'production') globalForPrisma.prisma = prisma
