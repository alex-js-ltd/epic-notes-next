'use client' // Error components must be Client Components

import { getErrorMessage } from '@/app/utils/misc'

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground">
			<p>{getErrorMessage(error)}</p>
		</div>
	)
}
