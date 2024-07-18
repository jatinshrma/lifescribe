import { Author, Post } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import { mongoAggregations } from "@helpers/utils"
import connectToDB from "@db/index"
import { getUserHeaders } from "@helpers/handleUserHeaders"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()

		const username = request.nextUrl.searchParams.get("username")
		const author = await Author.findOne({ username }, { _id: true })
		const posts = await Post.aggregate([
			{
				$match: {
					author: author?._id
				}
			},
			...(mongoAggregations.post_fetch as any)
		])

		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const POST = async (request: Request) => {
	try {
		const data = await request.json()
		data.author = getUserHeaders(request)?.user_id

		if (data?.newCollection) {
			const updated = await Author.findByIdAndUpdate(
				data?.author,
				{
					$push: {
						collections: data.newCollection
					}
				},
				{ new: true }
			)

			data.author_collection = updated?.collections?.at(-1)?._id
		}

		const post = await Post.create(data)
		return NextResponse.json({ succeed: true, postId: post?._id })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}
