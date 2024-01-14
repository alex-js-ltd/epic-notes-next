'use client'

import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/utils/misc'

interface ActiveLinkProps extends NextLinkProps {
	className?: string
	children: React.ReactNode
}

export default function ActiveLink({ className, ...props }: ActiveLinkProps) {
	const pathname = usePathname()

	const bold =
		typeof props.href === 'string' && pathname.includes(props.href)
			? true
			: false

	return <NextLink {...props} className={cn(className, bold && 'bg-accent')} />
}
