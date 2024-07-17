import mime from "mime"
import { join } from "path"
import { stat, mkdir, writeFile } from "fs/promises"
import * as dateFn from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { IAuthReqParams, IReqParams } from "@types"
import { NextApiRequest } from "next"
import useAuthRoute from "@lib/useAuthRoute"
import { Author } from "@db/models"

export async function uploadFile(request: NextRequest, params: IAuthReqParams) {
	const formData = await request.formData()

	const type = formData.get("type")
	const file = formData.get("file") as Blob | null
	if (!file) {
		return NextResponse.json({ error: "File blob is required." }, { status: 400 })
	}

	const buffer = Buffer.from(await file.arrayBuffer())
	const relativeUploadDir = `/uploads/${
		type === "profile_picture" ? `profile-picture-${params.tokenJson.id}` : dateFn.format(Date.now(), "dd-MM-Y")
	}`
	const uploadDir = join(process.cwd(), "public", relativeUploadDir)

	try {
		await stat(uploadDir)
	} catch (e: any) {
		if (e.code === "ENOENT") {
			await mkdir(uploadDir, { recursive: true })
		} else {
			console.error("Error while trying to create directory when uploading a file\n", e)
			return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
		}
	}

	try {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
		const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime.getExtension(file.type)}`
		await writeFile(`${uploadDir}/${filename}`, buffer)
		if (type === "profile_picture") {
			await Author.findByIdAndUpdate(params.tokenJson.id, {
				profile_picture: relativeUploadDir
			})
		}
		return NextResponse.json({ file_url: `${relativeUploadDir}/${filename}` })
	} catch (e) {
		console.error("Error while trying to upload a file\n", e)
		return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
	}
}

export const POST = (req: NextApiRequest, req_params: IReqParams) => useAuthRoute(req, uploadFile, req_params)
