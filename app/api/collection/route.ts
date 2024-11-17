import connectToDB from "@db/index"
import { User, CollectionModel, Post } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import mongoose from "mongoose"
import { Mongoose } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")
		const attachPosts = request.nextUrl.searchParams.get("attachPosts")
		const isPrivate = request.nextUrl.searchParams.get("private") || ""
		const visibilityInsensitive = request.nextUrl.searchParams.get("visibilityInsensitive") || ""
		const skipPages = request.nextUrl.searchParams.get("skipPages") || ""
		const totalPages = request.nextUrl.searchParams.get("totalPages") || ""
		const pageSize = request.nextUrl.searchParams.get("pageSize") || ""

		const user = await User.findOne({ username }, { _id: true })
		const matchQuery: {
			user: mongoose.Types.ObjectId | undefined
			private?: boolean
		} = {
			user: user?._id,
			private: Boolean(+isPrivate)
		}

		if (+visibilityInsensitive) delete matchQuery.private

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

export const DELETE = async (request: NextRequest) => {
	try {
		await connectToDB()
		const collId = request.nextUrl.searchParams.get("collectionId") as string
		const collectionId = new mongoose.Types.ObjectId(collId)

		const deleteOption = request.nextUrl.searchParams.get("collecetionId") || ""

		await CollectionModel.findByIdAndDelete(collectionId)

		if (+deleteOption === -1) await Post.deleteMany({ user_collection: collectionId })
		else if (+deleteOption === 0)
			await Post.updateMany(
				{ user_collection: collectionId },
				{ $set: { private: 0 }, $unset: { user_collection: "" } }
			)
		else if (+deleteOption === 1)
			await Post.updateMany(
				{ user_collection: collectionId },
				{ $set: { private: 1 }, $unset: { user_collection: "" } }
			)

		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
