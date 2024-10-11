import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import connectToDB from "@db/index"
import { User } from "@db/models"

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
				const userExists = await User.findOne({ email: profile?.email })
				if (!userExists) {
					await User.create({
						email: profile?.email,
						username: profile?.email?.split("@")[0],
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
			const DBUser = token?.email ? await User.findOne({ email: token.email }) : null
			if (DBUser) {
				token.isNew = Boolean(DBUser.new_user)
				token.name = DBUser.name
				token.picture = DBUser.profile_picture
				token.user_id = DBUser._id?.toString()
				token.username = DBUser.username?.toString()
			}

			return token
		},
		async session({ session, token }) {
			if (token.username) {
				session.user.isNew = token.isNew
				session.user.image = token.picture
				session.user.name = token.name
				session.user.username = token.username
			}
			return session
		}
	}
}
