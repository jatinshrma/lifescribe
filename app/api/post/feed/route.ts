import { User, Post } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@db/index"
import { postsAutherDetails, postsCheckReadingList, postsRegexPipeline } from "@helpers/mongoPipelines"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl?.searchParams?.get("username")
		const matchQuery = []
		const user = username ? await User.findOne({ username }, { _id: 1 }) : null

		if (user?._id)
			matchQuery.push({
				$match: {
					$and: [
						{
							user: {
								$ne: user?._id
							}
						},
						{
							private: {
								$ne: true
							}
						}
					]
				}
			})

		const pipeline = [
			...matchQuery,
			...postsRegexPipeline,
			...postsAutherDetails,
			...(user?._id ? (postsCheckReadingList(user?._id) as any[]) : []),
			{
				$project: {
					user_collection: 0,
					private: 0
				}
			},
			{
				$sort: {
					created_at: -1
				}
			}
		]

		const posts = await Post.aggregate(pipeline)
		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
