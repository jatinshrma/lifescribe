import connectToDB from "@db"
import { Tag } from "@db/models"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const tags = await Tag.find(
			{},
			{
				parents: 0,
				__v: 0
			}
		)
		return NextResponse.json(tags)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
