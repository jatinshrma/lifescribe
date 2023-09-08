import { BlogPost } from "@models"
import { NextApiRequest } from "next/types"
import { NextResponse } from "next/server"
import connectToDB from "@lib/db"
import { mongoAggregations } from "@utils"

export const GET = async (request: NextApiRequest) => {
	try {
		await connectToDB()
		const posts = await BlogPost.aggregate(mongoAggregations.blogpost_fetch)
		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
