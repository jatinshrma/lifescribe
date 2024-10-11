import { Post, PostLikes } from "@db/models"
import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@db/index"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import mongoose from "mongoose"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
	try {
		connectToDB()
		const postId = params?.id
		const { user_id } = getUserHeaders(request)
		const currPostLikes = await PostLikes.aggregate([
			{
				$match: {
					post: new mongoose.Types.ObjectId(postId)
				}
			},
			{
				$project: {
					isLiked: {
						$in: [new mongoose.Types.ObjectId(user_id), "$users"]
					}
				}
			}
		])

		console.log({ currPostLikes })

		let status = false
		if (!currPostLikes?.[0]) {
			await PostLikes.create({
				post: postId,
				users: [user_id]
			})
			status = true
		} else {
			status = currPostLikes?.[0]?.isLiked
			console.log({ status })
			await PostLikes.findByIdAndUpdate(currPostLikes[0]._id, {
				[status ? "$pull" : "$push"]: {
					users: user_id
				}
			})
			status = !status
		}

		Post.findByIdAndUpdate(postId, {
			$inc: {
				likes: status ? 1 : -1
			}
		})

		return NextResponse.json({ success: true, isLiked: status })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
