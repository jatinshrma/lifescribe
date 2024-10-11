import mime from "mime"
import { join } from "path"
import { stat, mkdir, writeFile } from "fs/promises"
import * as dateFn from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { User } from "@db/models"
import { getUserHeaders } from "@helpers/handleUserHeaders"

export const POST = async (request: NextRequest) => {
	const { user_id } = getUserHeaders(request)
	const formData = await request.formData()

	const type = formData.get("type")
	const file = formData.get("file") as Blob | null
	if (!file) {
		return NextResponse.json({ error: "File blob is required." }, { status: 400 })
	}

	const buffer = Buffer.from(await file.arrayBuffer())
	const userUploadDir = "public/uploads/" + user_id

	try {
		await stat(join(process.cwd(), userUploadDir))
	} catch (e: any) {
		if (e.code === "ENOENT") {
			await mkdir(join(process.cwd(), userUploadDir), { recursive: true })
		} else {
			console.error("Error while trying to create directory when uploading a file\n", e)
			return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
		}
	}

	try {
		const fileName = `${type}-${dateFn.format(Date.now(), "yyyy-MM-dd-HH-mm")}.${mime.getExtension(file.type)}`
		let filePath = userUploadDir + "/" + fileName

		await writeFile(join(process.cwd(), filePath), buffer as any)

		filePath = "/" + filePath.split("/").slice(1).join("/")
		if (type === "profile-picture") {
			await User.findByIdAndUpdate(user_id, {
				profile_picture: filePath
			})
		}

		return NextResponse.json({ filePath })
	} catch (e) {
		console.error("Error while trying to upload a file\n", e)
		return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
	}
}
