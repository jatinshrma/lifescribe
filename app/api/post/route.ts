import { User, CollectionModel, Post } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@db/index"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { postsRegexPipeline } from "@helpers/mongoPipelines"
import mongoose from "mongoose"

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
		const isPrivate = request.nextUrl.searchParams.get("private") || ""
		const skipPages = request.nextUrl.searchParams.get("skipPages") || ""
		const totalPages = request.nextUrl.searchParams.get("totalPages") || ""
		const pageSize = request.nextUrl.searchParams.get("pageSize") || ""

		const user = await User.findOne({ username }, { _id: true })
		const matchQuery = {
			user: user?._id,
			private: Boolean(+isPrivate)
		}

		const totalPagesCount = +totalPages || (await Post.countDocuments(matchQuery))
		const result = await Post.aggregate([
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

			...postsRegexPipeline,
			{
				$lookup: {
					from: "tags",
					localField: "tags",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								name: 1
							}
						}
					],
					as: "tags"
				}
			},
			{
				$addFields: {
					tags: "$tags.name"
				}
			}
		])

		return NextResponse.json({ result, totalPages: totalPagesCount })
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
			data.private = data.newCollection.private
		} else if (data?.user_collection) {
			const coll = await CollectionModel.findById(new mongoose.Types.ObjectId(data.user_collection), {
				private: 1
			})

			data.private = coll?.private
		}

		const post = await Post.create(data)
		return NextResponse.json({ succeed: true, postId: post?._id })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		let { postId, ...data }: any = await request.json()
		data.user = getUserHeaders(request)?.user_id

		if (data?.newCollection) {
			const newCollection = await CollectionModel.create({
				user: data.user,
				name: data.newCollection.name,
				private: data.newCollection.private
			})

			data.user_collection = newCollection?._id
			data.private = data.newCollection.private
		} else {
			const currentPost = await Post.findById(postId, { user_collection: 1, private: 1 })
			if (data.user_collection && currentPost?.user_collection?.toString() !== data.user_collection) {
				const coll = await CollectionModel.findById(new mongoose.Types.ObjectId(data.user_collection), {
					private: 1
				})

				data.private = coll?.private
			} else if (currentPost?.user_collection && !data.user_collection) {
				data = {
					$set: {
						...data
					},
					$unset: {
						user_collection: ""
					}
				}
			}
		}

		await Post.findByIdAndUpdate(postId, data)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
