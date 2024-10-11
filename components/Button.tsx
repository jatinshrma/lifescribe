import React from "react"
import { IconType } from "react-icons/lib"

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
	loading?: boolean
	Icon?: IconType
	iconsClassName?: string
	spinnerClassName?: string
}

const Button = ({
	children,
	disabled,
	className = "",
	loading = false,
	Icon,
	iconsClassName = "",
	spinnerClassName = "",
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			disabled={disabled || loading}
			className={"theme-button flex gap-2 items-center text-opacity-100 disabled:pointer-events-none " + className}
		>
			{loading ? (
				<span className={"custom-spinner " + spinnerClassName} />
			) : Icon ? (
				<Icon className={iconsClassName} />
			) : null}
			{children}
		</button>
	)
}

export default Button
