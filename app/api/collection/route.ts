import connectToDB from "@db/index"
import { User, CollectionModel } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")
		const attachPosts = request.nextUrl.searchParams.get("attachPosts")
		const user = await User.findOne({ username }, { _id: true })

		const collections = !attachPosts
			? await CollectionModel.find({ user: user?._id })
			: await CollectionModel.aggregate([
					{
						$match: {
							user: user?._id
						}
					},
					{
						$lookup: {
							from: "posts",
							localField: "_id",
							foreignField: "user_collection",
							pipeline: [
								{
									$sort: {
										created_at: -1
									}
								},
								{
									$project: {
										created_at: 1
									}
								}
							],
							as: "_posts_"
						}
					},
					{
						$addFields: {
							total_posts: {
								$size: "$_posts_"
							},
							recent_post: {
								$first: "$_posts_.created_at"
							}
						}
					},
					{
						$unset: "_posts_"
					}
			  ])

		return NextResponse.json(collections)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const POST = async (request: Request) => {
	try {
		const data = await request.json()
		await CollectionModel.create({
			user: getUserHeaders(request)?.user_id,
			name: data.name,
			private: data.private
		})

		return NextResponse.json({ succeed: true })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		await connectToDB()

		const data = await request.json()
		const updated: any = {}
		if (data.name) updated.name = data.name
		if (data.private) updated.private = data.private

		const result = await CollectionModel.findByIdAndUpdate(data._id, updated)

		return NextResponse.json({
			success: Boolean(result)
		})
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
