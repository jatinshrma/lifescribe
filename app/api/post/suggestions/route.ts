import { Post } from "@db/models"
import { NextResponse } from "next/server"
import { mongoAggregations } from "@helpers/utils"
import connectToDB from "@db/index"

export const GET = async (request: Request) => {
	try {
		await connectToDB()
		const posts = await Post.aggregate(mongoAggregations.post_fetch)
		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
