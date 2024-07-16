import { NextApiRequest, NextApiResponse } from "next"
import connectToDB from "@lib/db"
import { Author } from "@models"
import { IAuthReqParams, IReqParams } from "@utils/types"
import { NextResponse } from "next/server"
import useAuthRoute from "@lib/useAuthRoute"
import mongoose from "mongoose"

const get = async (request: NextApiRequest, { tokenJson, error }: IAuthReqParams) => {
	try {
		await connectToDB()
		const author = await Author.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(tokenJson?.id)
				}
			},
			{
				$unwind: {
					path: "$collections",
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup: {
					from: "blogposts",
					localField: "collections._id",
					foreignField: "author_collection",
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
					_id: "$_id",
					saved_posts: {
						$first: "$saved_posts"
					},
					collections: {
						$push: "$collections"
					}
				}
			}
		])

		return NextResponse.json(author?.[0])
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const GET = (req: NextApiRequest) => useAuthRoute(req, get)
