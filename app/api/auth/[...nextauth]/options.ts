import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import connectToDB from "@db/index"
import { Author } from "@db/models"

const { GOOGLE_CLIENT_ID: clientId = "", GOOGLE_CLIENT_SECRET: clientSecret = "" } = process.env

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId,
			clientSecret
		})
	],
	session: {
		strategy: "jwt"
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
						name: profile?.name,
						new_user: true
					})
				}

				return true
			} catch (error: any) {
				console.log("Error checking if user exists: ", error.message)
				return false
			}
		},
		async jwt({ token }) {
			const DBUser = token?.email ? await Author.findOne({ email: token.email }) : null
			if (DBUser) {
				token.user_id = DBUser._id?.toString()
				token.username = DBUser.username?.toString()
			}

			return token
		},
		async session({ session, token }) {
			if (token.username) {
				session.user.username = token.username
			}
			return session
		}
	}
}
