import connectToDB from "@db/index"
import { Author } from "@db/models"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()
		const username = request.nextUrl.searchParams.get("username")
		const basic = request.nextUrl.searchParams.get("basic")

		const author = basic
			? await Author.findOne(
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
			: (
					await Author.aggregate([
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
								about: {
									$first: "$about"
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
			  )?.[0]

		return NextResponse.json(author)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		await connectToDB()
		const data: any = await request.json()

		const result = await Author.findOneAndUpdate(
			{ username: data?.username },
			{
				name: data?.name,
				username: data?.username,
				about: data?.about,
				gender: data?.gender,
				dob: data?.dob,
				interests: data?.interests,
				private: data?.private,
				new_user: false
			},
			{
				new: true
			}
		)

		return NextResponse.json({
			success: Boolean(result),
			result
		})
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
