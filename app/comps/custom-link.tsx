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

	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'

	return (
		<NextLink
			{...props}
			className={cn(
				navLinkDefaultClassName,
				pathname === props.href && 'bg-accent',
			)}
		/>
	)
}
