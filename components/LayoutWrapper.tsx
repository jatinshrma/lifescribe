import React, { Suspense } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import Link from "next/link"
import { RiQuillPenLine } from "react-icons/ri"
import Loading from "@app/(root)/loading"

export default function LayoutWrapper({
	children,
	showScribeButton,
	navActions
}: {
	children: React.ReactNode
	showScribeButton?: boolean
	navActions?: React.ReactNode
}) {
	return (
		<Suspense fallback={<Loading />}>
			<Navbar>
				{navActions}
				{showScribeButton && (
					<Link href={"/editor"}>
						<button className="theme-button primary">
							<RiQuillPenLine className="h-5 w-5" />
							<span>Scribe</span>
						</button>
					</Link>
				)}
			</Navbar>
			<main className="px-5">{children}</main>
			{/* <main id="app-content">{children}</main> */}
			{/* {children} */}
			<Footer />
		</Suspense>
	)
}
