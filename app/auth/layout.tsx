import React from 'react'
import { auth } from '@clerk/nextjs'

export default function Layout(props: {
	children: React.ReactNode
	signup: React.ReactNode
	onboard: React.ReactNode
}) {
	const { userId }: { userId: string | null } = auth()

	return <>{userId ? props.onboard : props.signup}</>
}
