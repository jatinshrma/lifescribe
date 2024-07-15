import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function LayoutWrapper({
	children,
	navActions
}: {
	children: React.ReactNode
	navActions?: React.ReactNode
}) {
	return (
		<div>
			<Navbar>{navActions}</Navbar>
			<main className="px-5">{children}</main>
			{/* <main id="app-content">{children}</main> */}
			{/* {children} */}
			<Footer />
		</div>
	)
}
