import NextAuth from "next-auth"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { Author } from "@models"
import connectToDB from "@lib/db"
import SignToken from "@lib/signToken"

const { GOOGLE_CLIENT_ID: clientId = "", GOOGLE_CLIENT_SECRET: clientSecret = "" } = process.env
const handler = NextAuth({
	providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: {
				email: { type: "email" },
				password: { type: "password" }
			},
			async authorize(credentials) {
				const author = await Author.findOne({ email: credentials?.email })
				if (!author) return null
				if (!bcrypt.compareSync(credentials?.password as string, author.password)) return null
				else
					return {
						id: author?._id.toString(),
						name: author.name,
						email: author.email,
						image: author.profile_picture || ""
					}
			}
		}),
		GoogleProvider({ clientId, clientSecret })
	],
	pages: {
		signIn: "/sign-in"
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
