import "../globals.css"
import type { Metadata } from "next"
import Provider from "@components/Provider"

export const metadata: Metadata = {
	title: "LifeScribe",
	description: "A Next.js 13 Blogging Platform For Scribers And Readers"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div id="app-wrapper">
					<Provider>{children}</Provider>
				</div>
			</body>
		</html>
	)
}
