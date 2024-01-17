'use client'

import { useId } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDebounce } from '@/app/utils/hooks'
import { Icon } from '@/app/comps/ui/_icon'
import { Input } from '@/app/comps/ui/input'
import { Label } from '@/app/comps/ui/label'
import { StatusButton } from '@/app/comps/ui/status-button'

export function SearchBar({
	action,
	autoFocus = false,
	autoSubmit = false,
}: {
	autoFocus?: boolean
	autoSubmit?: boolean
	action: string | ((formData: FormData) => void)
}) {
	const id = useId()
	const searchParams = useSearchParams()

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		const formData = new FormData(form)
		typeof action !== 'string' && action(formData)
	}, 400)

	return (
		<form
			className="flex flex-wrap items-center justify-center gap-2"
			onChange={e => autoSubmit && handleFormChange(e.currentTarget)}
			action={action}
		>
			<div className="flex-1">
				<Label htmlFor={id} className="sr-only">
					Search
				</Label>
				<Input
					type="search"
					name="search"
					id={id}
					defaultValue={searchParams.get('search') ?? ''}
					placeholder="Search"
					className="w-full"
					autoFocus={autoFocus}
				/>
			</div>
			<div>
				<StatusButton
					type="submit"
					className="flex w-full items-center justify-center"
					size="sm"
				>
					<Icon name="magnifying-glass" size="sm" />
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</form>
	)
}
