import "../globals.css"
import "./styles.css"
import type { Metadata } from "next"
import AuthProvider from "@context/AuthProvider"

export const metadata: Metadata = {
	title: "LifeScribe",
	description: "A Next.js 13 Postging Platform For Scribers And Readers"
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div id="app-wrapper">
					<AuthProvider>{children}</AuthProvider>
				</div>
			</body>
		</html>
	)
}
