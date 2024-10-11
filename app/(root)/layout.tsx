import "../globals.css"
import type { Metadata } from "next"
import AuthProvider from "@context/AuthProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const metadata: Metadata = {
	title: "LifeScribe",
	description: "A Next.js 13 Postging Platform For Scribers And Readers"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div id="app-wrapper">
					<AuthProvider>{children}</AuthProvider>
					<ToastContainer
						position="bottom-center"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
						progressClassName={"bg-whitePrimary text-opacity-100"}
					/>
				</div>
			</body>
		</html>
	)
}
