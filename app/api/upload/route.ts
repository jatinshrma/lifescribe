import { NextRequest, NextResponse } from "next/server"
import { User } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"
import { format } from "date-fns"
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary"

export const POST = async (request: NextRequest) => {
	const { user_id } = getUserHeaders(request)
	const formData = await request.formData()

	const type = formData.get("type")
	const file = formData.get("file") as Blob | null
	if (!file) return NextResponse.json({ error: "File blob is required." }, { status: 400 })

	try {
		const fileBuffer = Buffer.from(await file.arrayBuffer())
		const response: UploadApiResponse | UploadApiErrorResponse | undefined = await new Promise(
			(resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						resource_type: "auto",
						public_id: type === "profile_picture" ? type : `${type}_${format(Date.now(), "yyyy-MM-dd-HH-mm")}`,
						folder: `lifescribe/${type}/${user_id}`,
						overwrite: true
					},
					(error, result) => {
						if (error) {
							reject(error)
						} else {
							resolve(result)
						}
					}
				)

				uploadStream.end(fileBuffer)
			}
		)

		if (type === "profile_picture") {
			await User.findByIdAndUpdate(user_id, {
				profile_picture: response?.secure_url
			})
		}

		return NextResponse.json({ url: response?.secure_url })
	} catch (e) {
		console.error("Error while trying to upload a file\n", e)
		return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
	}
}
