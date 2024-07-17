import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { setUserHeaders } from "@helpers/handleUserHeaders"

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request, secret })
	if (!token) return
	// if (!request.nextUrl.pathname.startsWith("/sign-in"))
	// 	return NextResponse.redirect(new URL("/sign-in", request.url))

	const requestHeaders = setUserHeaders(request, token)
	const response = NextResponse.next({
		request: {
			headers: requestHeaders
		}
	})

	return response
}

export const config = {
	matcher: ["/api/:path*"]
}

export { default } from "next-auth/middleware"
