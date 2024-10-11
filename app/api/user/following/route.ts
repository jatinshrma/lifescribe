import connectToDB from "@db/index"
import { Following, User } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")

		const user = await User.findOne(
			{ username },
			{
				name: 1,
				username: 1,
				about: 1,
				gender: 1,
				dob: 1,
				interests: 1,
				private: 1
			}
		)

		return NextResponse.json(user)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		connectToDB()
		const { username } = await request.json()
		const userToFollow = (await User.findOne({ username: username }, { _id: 1 }))?._id

		let { user_id: loggedUserId } = getUserHeaders(request)
		if (loggedUserId) loggedUserId = new mongoose.Types.ObjectId(loggedUserId)

		const [currFollowing] = await Following.aggregate([
			{
				$match: {
					user: loggedUserId
				}
			},
			{
				$project: {
					isAlreadyFollowing: {
						$in: [userToFollow, "$following"]
					}
				}
			}
		])

		let status = false
		if (!currFollowing) {
			await Following.create({
				user: loggedUserId,
				following: [userToFollow]
			})
			status = true
		} else {
			status = currFollowing?.isAlreadyFollowing
			await Following.findOneAndUpdate(
				{ user: loggedUserId },
				{
					[status ? "$pull" : "$push"]: {
						following: userToFollow
					}
				}
			)
			status = !status
		}

		await User.findByIdAndUpdate(userToFollow, {
			$inc: {
				followers: status ? 1 : -1
			}
		})

		return NextResponse.json({ success: true, isFollowed: status })
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
