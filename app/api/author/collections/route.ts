import connectToDB from "@db/index"
import { Author } from "@db/models"
import { NextResponse } from "next/server"
import { getUserHeaders } from "@helpers/handleUserHeaders"

export const GET = async (request: Request) => {
	try {
		await connectToDB()
		const author = await Author.findOne(
			{
				email: getUserHeaders(request)?.email
			},
			{
				collections: 1
			}
		)

		return NextResponse.json(author?.collections)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
