import connectToDB from "@db/index"
import { User } from "@db/models"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")

		const user = await User.findOne(
			{ username },
			{
				name: 1,
				username: 1,
				about: 1,
				gender: 1,
				dob: 1,
				interests: 1,
				profile_picture: 1,
				private: 1
			}
		)

		return NextResponse.json(user)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		await connectToDB()
		const data: any = await request.json()

		const result = await User.findOneAndUpdate(
			{ username: data?.originalUsername || data?.username },
			{
				name: data?.name,
				username: data?.username,
				about: data?.about,
				gender: data?.gender,
				dob: data?.dob,
				interests: data?.interests,
				private: data?.private,
				new_user: false
			},
			{
				new: true
			}
		)

		return NextResponse.json({
			success: Boolean(result),
			result
		})
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
