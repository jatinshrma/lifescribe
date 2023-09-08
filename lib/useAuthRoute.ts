import connectToDB from "@lib/db"
import { NextApiRequest } from "next/types"
import { getToken } from "next-auth/jwt"
import jwt from "jsonwebtoken"
import { IAuthReqParams, IReqParams } from "@utils/types"

export default async (req: NextApiRequest, next: Function, req_params?: IReqParams) => {
	try {
		await connectToDB()
		const secret = process.env.NEXTAUTH_SECRET || ""
		const tokenData = await getToken({ req })
		// @ts-ignore
		const tokenJson = jwt.verify(tokenData.userToken, secret)
		return next(req, { tokenJson, req_params } as IAuthReqParams)
	} catch (error: any) {
		return next(req, { error: error.message })
	}
}
