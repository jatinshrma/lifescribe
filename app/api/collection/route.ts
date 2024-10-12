import connectToDB from "@db/index"
import { User, CollectionModel } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")
		const attachPosts = request.nextUrl.searchParams.get("attachPosts")
		const isPrivate = request.nextUrl.searchParams.get("private") || ""
		const skipPages = request.nextUrl.searchParams.get("skipPages") || ""
		const totalPages = request.nextUrl.searchParams.get("totalPages") || ""
		const pageSize = request.nextUrl.searchParams.get("pageSize") || ""

		const user = await User.findOne({ username }, { _id: true })
		const matchQuery = {
			user: user?._id,
			private: Boolean(+isPrivate)
		}

		const totalPagesCount = +totalPages || (await CollectionModel.countDocuments(matchQuery))

		const result = !attachPosts
			? await CollectionModel.find(matchQuery)
			: await CollectionModel.aggregate([
					{
						$match: matchQuery
					},
					{
						$sort: {
							created_at: -1
						}
					},
					{
						$skip: +skipPages * +pageSize
					},
					{
						$limit: +pageSize
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

		return NextResponse.json(!attachPosts ? result : { result, totalPages: totalPagesCount })
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
