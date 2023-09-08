import { Author, BlogPost } from "@models"
import { NextApiRequest } from "next/types"
import { NextResponse } from "next/server"
import connectToDB from "@lib/db"
import useAuthRoute from "@lib/useAuthRoute"
import { JwtPayload } from "jsonwebtoken"
import { mongoAggregations } from "@utils"
import { ObjectId } from "mongodb"
import { IAuthReqParams } from "@utils/types"

const get = async (request: NextApiRequest, { tokenJson, error }: IAuthReqParams) => {
	try {
		if (error) throw new Error(error)
		await connectToDB()
		const pipeline = [
			{
				$match: {
					author: new ObjectId(tokenJson?.id)
				}
			},
			...mongoAggregations.blogpost_fetch
		]
		const posts = await BlogPost.aggregate(pipeline)
		return NextResponse.json(posts)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

const postBlogPost = async (request: NextApiRequest, { tokenJson, error }: IAuthReqParams) => {
	try {
		if (error) throw new Error(error)
		// @ts-ignore
		const data = await request.json()
		data.author = await tokenJson?.id

		if (!(await Author.findById(data?.author))) {
			return NextResponse.json({ error: "Author Not Found." }, { status: 404 })
		}
		await BlogPost.create(data)
		return NextResponse.json({ succeed: true })
	} catch (error: any) {
		console.log(error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export const POST = (req: NextApiRequest) => useAuthRoute(req, postBlogPost)
export const GET = (req: NextApiRequest) => useAuthRoute(req, get)