'use client'
import Image from 'next/image'

export function Icon({ name }: { name: string }) {
	function myImageLoader({ src, width, quality }: any) {
		// const url = `http://localhost:3000/icons/${src}`

		const url = `/icons/${src}`
		console.log(url)

		return url
	}
	return (
		<Image
			loader={myImageLoader}
			src={`${name}.svg`}
			alt="plus"
			fill={true}
			priority
		/>
	)
}
