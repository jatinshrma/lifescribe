import { Post } from "@db/models"
import { NextApiRequest } from "next/types"
import { NextResponse } from "next/server"
import connectToDB from "@db/index"
import { IAuthReqParams, IReqParams } from "@types"

export const GET = async (request: NextApiRequest, { params }: IReqParams) => {
	try {
		await connectToDB()
		const post = await Post.findById(params?.id)
		return NextResponse.json(post)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const PUT = async (request: NextApiRequest, params: IAuthReqParams) => {
	try {
		const postId = params?.req_params?.params?.id
		const data = await request.body
		await Post.findByIdAndUpdate(postId, data)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const DELETE = async (request: NextApiRequest, params: IAuthReqParams) => {
	try {
		if (params?.error) throw Error(params?.error)
		const postId = params?.req_params?.params?.id
		await Post.findByIdAndDelete(postId)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
