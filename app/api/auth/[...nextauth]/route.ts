import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { Author } from "@models"
import connectToDB from "@lib/db"
import SignToken from "@lib/signToken"
import jwt from "jsonwebtoken"
import { getToken, JWT } from "next-auth/jwt"

const { GOOGLE_CLIENT_ID: clientId = "", GOOGLE_CLIENT_SECRET: clientSecret = "" } = process.env

const handler = NextAuth({
	providers: [GoogleProvider({ clientId, clientSecret })],
	pages: {
		signOut: "/"
		// newUser: "/auth/new-user"
	},
	callbacks: {
		async signIn({ profile, user }) {
			try {
				await connectToDB()
				const userExists = await Author.findOne({ email: profile?.email })
				if (!userExists) {
					await Author.create({
						email: profile?.email,
						profile_picture: user?.image,
						name: profile?.name
					})
				}

				return true
			} catch (error: any) {
				console.log("Error checking if user exists: ", error.message)
				return false
			}
		},
		async jwt({ token, user, account }) {
			if (account) {
				const author = await Author.findOne({ email: user?.email })
				const _token = await SignToken({ email: user?.email as string, id: author?._id?.toString() as string })
				token.userToken = _token
			}
			return token
		},
		async session({ session, token }) {
			return { ...session, session_token: token.userToken }
		}
	}
})

export { handler as GET, handler as POST }
