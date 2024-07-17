import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
	interface Session {
		user: {
			username: string
		} & DefaultSession["user"]
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user_id: string
		username: string
	}
}
