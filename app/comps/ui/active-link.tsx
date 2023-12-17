'use client'

import type { ReactNode } from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/lib/misc'

interface ActiveLinkProps extends NextLinkProps {
	className?: string
	children: ReactNode
}

export default function ActiveLink({ className, ...props }: ActiveLinkProps) {
	const pathname = usePathname()

	const bold =
		typeof props.href === 'string' && pathname.includes(props.href)
			? true
			: false

	return <NextLink {...props} className={cn(className, bold && 'bg-accent')} />
}
