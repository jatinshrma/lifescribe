import connectToDB from "@db"
import { Tag } from "@db/models"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()

		const interests = await Tag.aggregate([
			{
				$match: {
					parents: null
				}
			},
			{
				$lookup: {
					from: "tags",
					foreignField: "parents",
					localField: "_id",
					pipeline: [
						{
							$project: {
								name: 1
							}
						}
					],
					as: "children"
				}
			}
		])

		return NextResponse.json(interests)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
