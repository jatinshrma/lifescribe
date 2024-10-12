import connectToDB from "@db/index"
import { ReadingList, Tag } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { postsAutherDetails, postsRegexPipeline } from "@helpers/mongoPipelines"
import mongoose from "mongoose"
import { useSearchParams } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
	try {
		await connectToDB()

		// {
		// 	const tags = []
		// 	for (let index1 = 1; index1 < 10; index1++) {
		// 		const _id1 = new mongoose.Types.ObjectId()
		// 		tags.push({
		// 			_id: _id1,
		// 			name: `Tag A${index1}`,
		// 			parents: null
		// 		})
		// 		for (let index2 = 1; index2 <= 5; index2++) {
		// 			const _id2 = new mongoose.Types.ObjectId()
		// 			tags.push({
		// 				_id: _id2,
		// 				name: `Tag A${index1}:B${index2}`,
		// 				parents: [_id1]
		// 			})
		// 			for (let index3 = 1; index3 <= 3; index3++) {
		// 				const _id3 = new mongoose.Types.ObjectId()
		// 				tags.push({
		// 					_id: _id3,
		// 					name: `Tag A${index1}:B${index2}:C${index3}`,
		// 					parents: [_id1, _id2]
		// 				})
		// 			}
		// 		}
		// 	}

		// 	for (const element of tags) {
		// 		await Tag.create(element)
		// 	}
		// }

		const { user_id } = getUserHeaders(request)
		const isPrivate = request.nextUrl.searchParams.get("private") || ""
		const skipPages = request.nextUrl.searchParams.get("skipPages") || ""
		const totalPages = request.nextUrl.searchParams.get("totalPages") || ""
		const pageSize = request.nextUrl.searchParams.get("pageSize") || ""
		const recent = Boolean(request.nextUrl?.searchParams?.get("recent"))
		const matchQuery = { user: user_id }

		const totalPagesCount =
			+totalPages ||
			(
				await ReadingList.aggregate([
					{
						$match: matchQuery
					},
					{
						$unwind: {
							path: "$posts",
							preserveNullAndEmptyArrays: false
						}
					},
					{
						$count: "count"
					}
				])
			)?.[0]?.count

		const skipAndLimit = recent
			? [
					{
						$limit: 10
					}
			  ]
			: [
					{
						$skip: +skipPages * +pageSize
					},
					{
						$limit: +pageSize
					}
			  ]

		const readingList = await ReadingList.aggregate([
			{
				$match: {
					user: new mongoose.Types.ObjectId(user_id)
				}
			},
			{
				$set: {
					posts: {
						$sortArray: {
							input: "$posts",
							sortBy: {
								timestamp: -1
							}
						}
					}
				}
			},
			...skipAndLimit,
			{
				$unwind: {
					path: "$posts",
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup: {
					from: "posts",
					localField: "posts.post_id",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								_id: 0,
								title: 1,
								user: 1,
								...(!recent ? { content: 1 } : {})
							}
						},
						...postsRegexPipeline,
						...postsAutherDetails
					],
					as: "_posts_"
				}
			},
			{
				$set: {
					posts: {
						$mergeObjects: [
							{
								$first: "$_posts_"
							},
							"$posts"
						]
					}
				}
			},
			{
				$group: {
					_id: "$_id",
					posts: {
						$push: "$posts"
					}
				}
			}
		])

		return NextResponse.json(
			recent
				? readingList?.[0] || null
				: {
						result: readingList?.[0]?.posts,
						totalPages: totalPagesCount
				  }
		)
	} catch (error: any) {
		console.error(error.message)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const POST = async (request: NextRequest) => {
	try {
		await connectToDB()
		const { post_id } = await request.json()
		const userDetails = getUserHeaders(request)
		const userReadingList = await ReadingList.findOne({
			user: userDetails?.user_id
		})

		let status = false

		if (!userReadingList) {
			await ReadingList.create({
				user: userDetails?.user_id,
				posts: [
					{
						post_id: post_id
					}
				]
			})

			status = true
		} else {
			status = userReadingList?.posts?.some(i => i.post_id?.toString() === post_id)
			const action = status ? "$pull" : "$push"

			await ReadingList.findByIdAndUpdate(userReadingList?._id, {
				[action]: {
					posts: {
						post_id: post_id
					}
				}
			})
			status = !status
		}

		return NextResponse.json({
			success: true,
			updatedStatus: status
		})
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
