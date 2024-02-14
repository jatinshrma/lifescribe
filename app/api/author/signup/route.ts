// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from "next"
import connectToDB from "@lib/db"
import { Author } from "@models"
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { name, email, dob, gender, password } = req.body

		try {
			await connectToDB()

			// Check if the user with the provided email already exists
			const existingUser = await Author.findOne({ email })

			if (existingUser) {
				return res.status(400).json({ error: "User with this email already exists" })
			}

			// Hash the password before storing it
			const hashedPassword = await bcrypt.hash(password, 10)

			// Create a new user in the database
			const newUser = await Author.create({
				name,
				email,
				dob,
				gender,
				password: hashedPassword
			})

			return res.status(201).json({ message: "User created successfully", user: newUser })
		} catch (error) {
			console.error("Error creating user:", error)
			return res.status(500).json({ error: "Internal Server Error" })
		}
	} else {
		return res.status(405).json({ error: "Method Not Allowed" })
	}
}
