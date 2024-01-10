import { Honeypot, SpamError } from 'remix-utils/honeypot/server'
import { getEnv } from './env.server'

const { MODE, HONEYPOT_SECRET } = getEnv()

export const honeypot = new Honeypot({
	validFromFieldName: MODE === 'test' ? null : undefined,
	encryptionSeed: HONEYPOT_SECRET,
})

export function checkHoneypot(formData: FormData) {
	try {
		honeypot.check(formData)
	} catch (error) {
		console.log(error)
		if (error instanceof SpamError) {
			throw new Error('Form not submitted properly')
		}
		throw error
	}
}
