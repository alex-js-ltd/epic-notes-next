import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/app/utils/db'

import { getEnv } from '@/app/utils/env.server'

const { CLERK_WEBHOOK_SECRET } = getEnv()

const webhookSecret = CLERK_WEBHOOK_SECRET as string

const validateRequest = async (request: Request) => {
	const payloadString = await request.text()
	const headerPayload = headers()

	const svixHeaders = {
		'svix-id': headerPayload.get('svix-id')!,
		'svix-timestamp': headerPayload.get('svix-timestamp')!,
		'svix-signature': headerPayload.get('svix-signature')!,
	}
	const wh = new Webhook(webhookSecret)
	return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export async function POST(request: Request) {
	const payload = await validateRequest(request)

	if (payload.type === 'user.created') {
		try {
			const user = await prisma.user.create({
				data: {
					id: payload.data.id,
					email: payload.data.email_addresses[0]?.email_address,
				},
			})
			return Response.json({ message: user })
		} catch (error) {
			return Response.json({ message: error })
		}
	}

	return Response.json({ message: 'cannot create user' })
}
