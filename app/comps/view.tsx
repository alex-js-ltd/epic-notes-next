'use client'

import type { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'

export function View({
	hide,
	children,
}: PropsWithChildren<{ hide: Array<string> }>) {
	const pathname = usePathname()

	const includes = hide.includes(pathname)

	return includes ? null : children
}
