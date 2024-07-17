import connectToDB from "@db/index"
import { Author } from "@db/models"
import { PipelineStage } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")

		const author = await Author.aggregate([
			{
				$match: {
					username
				}
			},
			{
				$unwind: {
					path: "$collections",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: "posts",
					localField: "_id",
					foreignField: "author",
					pipeline: [
						{
							$project: {
								created_at: 1,
								tags: 1
							}
						},
						{
							$sort: {
								created_at: -1
							}
						}
					],
					as: "collections.posts"
				}
			},
			{
				$group: {
					_id: 0,
					name: {
						$first: "$name"
					},
					bio: {
						$first: "$bio"
					},
					saved_posts: {
						$first: "$saved_posts"
					},
					collections: {
						$push: "$collections"
					},
					created_at: {
						$first: "$created_at"
					}
				}
			}
		])

		return NextResponse.json(author?.[0])
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
