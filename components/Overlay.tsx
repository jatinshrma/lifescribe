import React from "react"

const Overlay = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="z-50 fixed top-0 left-0 w-full h-full bg-[#000000d6] flex items-center justify-center">
			{children}
		</div>
	)
}

export default Overlay
