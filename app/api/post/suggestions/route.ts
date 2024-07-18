import { Author, Post } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import { mongoAggregations } from "@helpers/utils"
import connectToDB from "@db/index"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl?.searchParams?.get("username")
		const pipeline = []
		if (username) {
			const user = await Author.findOne({ username }, { _id: 1 })
			if (user?._id)
				pipeline.push({
					$match: {
						author: {
							$ne: user?._id
						}
					}
				})
		}

		const posts = await Post.aggregate(pipeline.concat(mongoAggregations.post_fetch as any))
		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
