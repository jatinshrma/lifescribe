import { JWT } from "next-auth/jwt"

const headerFields = [
	{ tokenField: "email", headerField: "x-user-email" },
	{ tokenField: "user_id", headerField: "x-user-user-id" },
	{ tokenField: "username", headerField: "x-user-username" }
]

export const getUserHeaders = (req: Request) => {
	return headerFields.reduce(
		(result, obj) => ({ ...result, [obj.tokenField]: req.headers.get(obj.headerField) }),
		{
			email: "",
			user_id: "",
			username: ""
		}
	)
}

export const setUserHeaders = (req: Request, token: JWT): Headers => {
	const requestHeaders = new Headers(req.headers)
	for (const obj of headerFields) {
		requestHeaders.set(obj.headerField, token[obj.tokenField] as string)
	}
	return requestHeaders
}
