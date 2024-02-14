import { Cursor } from "mongoose"
import React, { LegacyRef, StyleHTMLAttributes, useEffect } from "react"
import { useRef } from "react"

interface BlurWatcherParams {
	id?: string
	className?: string
	onClick?: () => false | void
	children: string | JSX.Element | JSX.Element[]
	onClickOutside: () => null | void | undefined
	style?: React.CSSProperties
}

const BlurWatcher = ({ children, onClickOutside, ...props }: BlurWatcherParams) => {
	const ref: LegacyRef<HTMLDivElement> | undefined = useRef(null)

	useEffect(() => {
		const blur = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onClickOutside()
		}
		document.addEventListener("click", blur)
		return () => document.removeEventListener("click", blur)
	}, [ref])

	return (
		<div tabIndex={1} ref={ref} {...props}>
			{children}
		</div>
	)
}

export default BlurWatcher
