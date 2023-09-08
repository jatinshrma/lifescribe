import { File } from "buffer"
import { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose"
import { Dispatch, SetStateAction } from "react"

export interface IBlogPost {
	title: string
	content: string
	author: mongoose.Schema.Types.ObjectId
	tags: string[]
	created_at: Date
	reading_time: number
}

export interface IBlogCardProps extends IBlogPost {
	_id: mongoose.Schema.Types.ObjectId
	author_image: string
	profile_view?: boolean
}

export interface IAuthor {
	profile_picture: string
	name: string
	bio: string
	saved_posts: string[]
	email: string
	password: string
	created_at: Date
}

export interface IEditorProps {
	blogContent: string
	setBlogContent: Dispatch<SetStateAction<string>>
	title: string
	setTitle: Dispatch<SetStateAction<string>>
	updateInDB: (reading_time: number) => Promise<void>
}

export interface IReqParams {
	params: { [key: string]: string }
}

export interface IAuthReqParams {
	tokenJson: JwtPayload
	req_params?: IReqParams
	error?: string
}
