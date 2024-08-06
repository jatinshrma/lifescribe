import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { setUserHeaders } from "@helpers/handleUserHeaders"

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request, secret })
	const redirect = (url: string) => NextResponse.redirect(new URL(url, request.url))
	const { pathname } = request.nextUrl

	if (!token && ["/api/upload", "/onboarding", "/settings"].find(i => pathname.startsWith(i)))
		return redirect("/sign-in")
	if ((token && pathname.startsWith("/sign-in")) || (!token?.isNew && pathname.startsWith("/onboarding")))
		return redirect("/")
	if (token?.isNew && pathname.startsWith("/user") && pathname?.split("/")?.at(-1) === token.username)
		return redirect("/onboarding")

	if (token) {
		const requestHeaders = setUserHeaders(request, token)
		const response = NextResponse.next({
			request: {
				headers: requestHeaders
			}
		})
		return response
	}
}

export const config = {
	matcher: "/:path*"
}

export { default } from "next-auth/middleware"
