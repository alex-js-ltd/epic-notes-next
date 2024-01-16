'use client'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import { Button } from './ui/button'
import { Icon } from '@/app/comps/ui/_icon'

export function LogoutButton() {
	const { signOut } = useClerk()
	const router = useRouter()

	return (
		<Button
			type="submit"
			variant="link"
			size="pill"
			onClick={() => signOut(() => router.push('/'))}
		>
			<Icon name="exit" className="scale-125 max-md:scale-150">
				Logout
			</Icon>
		</Button>
	)
}
