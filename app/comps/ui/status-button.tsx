'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import { cn } from '@/app/lib/misc'
import { Button, type ButtonProps } from './button'

export const StatusButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, ...props }, ref) => {
		const { pending } = useFormStatus()

		const status = pending ? 'pending' : 'idle'

		const companion = {
			pending: <span className="inline-block animate-spin">🌀</span>,
			success: <span>✅</span>,
			error: <span>❌</span>,
			idle: null,
		}[status]

		return (
			<Button
				ref={ref}
				className={cn('flex justify-center gap-4', className)}
				disabled={pending}
				{...props}
			>
				<div>{children}</div>
				{companion}
			</Button>
		)
	},
)
StatusButton.displayName = 'Button'
