'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service

		console.log(error.message)
	}, [error])

	return (
		<div className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground">
			<p>{error.message}</p>
		</div>
	)
}
