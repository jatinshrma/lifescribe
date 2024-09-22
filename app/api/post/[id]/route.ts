import { Following, Post, PostLikes, ReadingList } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@db/index"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import mongoose from "mongoose"

interface IParams {
	params: {
		id: string | mongoose.Types.ObjectId
	}
}

export const GET = async (request: NextRequest, { params }: IParams) => {
	try {
		let loggedInUser: string | mongoose.Types.ObjectId = getUserHeaders(request)?.user_id
		if (loggedInUser) loggedInUser = new mongoose.Types.ObjectId(loggedInUser)
		if (params?.id) params.id = new mongoose.Types.ObjectId(params.id)

		await connectToDB()
		const [post] = await Post.aggregate([
			{
				$match: {
					_id: params?.id
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								name: true,
								username: true,
								profile_picture: true,
								followers: true
							}
						}
					],
					as: "_user_"
				}
			},
			{
				$lookup: {
					from: "collections",
					localField: "user_collection",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								name: true
							}
						}
					],
					as: "_coll_"
				}
			},
			{
				$set: {
					user: {
						$first: "$_user_"
					},
					user_collection: {
						$first: "$_coll_"
					}
				}
			},
			{
				$project: {
					private: 0,
					_user_: 0,
					_coll_: 0
				}
			}
		])

		if (loggedInUser && post.user._id.toString() !== loggedInUser.toString()) {
			const [[postLike], [readingList], [following]] = await Promise.all([
				PostLikes.aggregate([
					{
						$match: {
							post: params.id
						}
					},
					{
						$project: {
							isLiked: {
								$in: [loggedInUser, "$users"]
							}
						}
					}
				]),
				ReadingList.aggregate([
					{
						$match: {
							user: loggedInUser
						}
					},
					{
						$project: {
							inReadingList: {
								$in: [post._id, "$posts.post_id"]
							}
						}
					}
				]),
				Following.aggregate([
					{
						$match: {
							user: loggedInUser
						}
					},
					{
						$project: {
							isFollowed: {
								$in: [post.user._id, "$following"]
							}
						}
					}
				])
			])

			post.isLiked = Boolean(postLike?.isLiked)
			post.inReadingList = Boolean(readingList?.inReadingList)
			post.user.isFollowed = Boolean(following?.isFollowed)
		}

		delete post.user._id
		return NextResponse.json(post)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest, { params }: IParams) => {
	try {
		const postId = params?.id
		const data: any = await request.json()
		await Post.findByIdAndUpdate(postId, data)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const DELETE = async (request: NextRequest, { params }: IParams) => {
	try {
		const postId = params?.id
		await Post.findByIdAndDelete(postId)
		await PostLikes.findOne({ post: postId })
		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
