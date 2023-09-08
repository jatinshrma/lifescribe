import jwt from "jsonwebtoken"

const { NEXTAUTH_SECRET = "" } = process.env
const SignToken = async (params: { email: string; id: string }) => {
	const token = jwt.sign(params, NEXTAUTH_SECRET, { expiresIn: "1d" })
	return token
}

export default SignToken
