import { useEffect, useState, useRef, useMemo } from 'react'
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

/**
 * Simple debounce implementation
 */
function debounce<Callback extends (...args: Parameters<Callback>) => void>(
	fn: Callback,
	delay: number,
) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

/**
 * Debounce a callback function
 */
export function useDebounce<
	Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
	const callbackRef = useRef(callback)
	useEffect(() => {
		callbackRef.current = callback
	})
	return useMemo(
		() =>
			debounce(
				(...args: Parameters<Callback>) => callbackRef.current(...args),
				delay,
			),
		[delay],
	)
}
