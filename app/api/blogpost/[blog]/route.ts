import { BlogPost } from "@models"
import { NextApiRequest } from "next/types"
import { NextResponse, NextRequest } from "next/server"
import useAuthRoute from "@lib/useAuthRoute"
import connectToDB from "@lib/db"
import { IAuthReqParams, IReqParams } from "@utils/types"

export const GET = async (request: NextApiRequest, { params }: IReqParams) => {
	try {
		await connectToDB()
		const blogpost = await BlogPost.findById(params?.blog)
		return NextResponse.json(blogpost)
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

const updateRequest = async (request: NextRequest, params: IAuthReqParams) => {
	try {
		if (params?.error) throw Error(params?.error)
		const blogId = params?.req_params?.params?.blog
		const data = await request.json()
		await BlogPost.findByIdAndUpdate(blogId, data)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

const deleteRequest = async (request: NextApiRequest, params: IAuthReqParams) => {
	try {
		if (params?.error) throw Error(params?.error)
		const blogId = params?.req_params?.params?.blog
		await BlogPost.findByIdAndDelete(blogId)
		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error(error)
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}

export const DELETE = (req: NextApiRequest, req_params: IReqParams) => useAuthRoute(req, deleteRequest, req_params)
export const PUT = (req: NextApiRequest, req_params: IReqParams) => useAuthRoute(req, updateRequest, req_params)
