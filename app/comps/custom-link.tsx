'use client'
import type { ReactNode } from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/lib/misc'

interface CustomLinkProps extends NextLinkProps {
	className?: string
	children: ReactNode
}

export default function CustomLink({ className, ...props }: CustomLinkProps) {
	const pathname = usePathname()

	return (
		<NextLink
			{...props}
			className={cn(className, pathname === props.href && 'bg-accent')}
		/>
	)
}
