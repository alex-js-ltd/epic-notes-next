import { useEffect, useState } from 'react'
export function useFocusInvalid(
	formEl: HTMLFormElement | null,
	hasErrors: boolean,
) {
	useEffect(() => {
		if (!formEl) return
		if (!hasErrors) return

		if (formEl.matches('[aria-invalid="true"]')) {
			formEl.focus()
		} else {
			const firstInvalid = formEl.querySelector('[aria-invalid="true"]')
			if (firstInvalid instanceof HTMLElement) {
				firstInvalid.focus()
			}
		}
	}, [formEl, hasErrors])
}

export function useHydrated() {
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])
	return hydrated
}
