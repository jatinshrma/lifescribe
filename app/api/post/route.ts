import { User, CollectionModel, Post } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@db/index"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { postsRegexPipeline } from "@helpers/mongoPipelines"

// export const GET = async (request: NextRequest) => {
// 	try {
// 		await connectToDB()

// 		for (const post of list) {
// 			await Post.create({
// 				user: new mongoose.Types.ObjectId("669d470eeef6bf3a81d31241"),
// 				title: post.title,
// 				content: "<p>" + post.description + "</p>",
// 				tags: [],
// 				created_at: new Date(post.creation_date),
// 				reading_time: parseInt(post.reading_time?.split?.(" ")[0]),
// 				private: false
// 			})
// 		}

// 		return NextResponse.json({ success: true })
// 	} catch (error: any) {
// 		console.error(error.message)
// 		return NextResponse.json({ message: error.message }, { status: 500 })
// 	}
// }

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()

		const username = request.nextUrl.searchParams.get("username")
		const user = await User.findOne({ username }, { _id: true })
		const posts = await Post.aggregate([
			{
				$match: {
					user: user?._id
				}
			},
			...postsRegexPipeline,
			{
				$sort: {
					created_at: -1
				}
			}
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
		data.user = getUserHeaders(request)?.user_id

		if (data?.newCollection) {
			const newCollection = await CollectionModel.create({
				user: data.user,
				name: data.newCollection.name,
				private: data.newCollection.private
			})

			data.user_collection = newCollection?._id
		}

		const post = await Post.create(data)
		return NextResponse.json({ succeed: true, postId: post?._id })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}