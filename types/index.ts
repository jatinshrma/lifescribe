import { JwtPayload } from "jsonwebtoken"
import mongoose, { Date } from "mongoose"
import { Session } from "next-auth"
import { BuiltInProviderType } from "next-auth/providers/index"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"
import { IconType } from "react-icons"

export interface IPost {
	_id?: string
	title: string
	content: string
	user: mongoose.Schema.Types.ObjectId | string
	user_collection?: mongoose.Schema.Types.ObjectId | string
	private: boolean
	tags: (mongoose.Schema.Types.ObjectId | string)[]
	created_at: Date
	reading_time: number
	likes: number
	isLiked?: boolean
	inReadingList?: boolean
}

export interface IPostCardProps {
	_id: mongoose.Schema.Types.ObjectId | string
	user?: {
		profile_picture: IUser["profile_picture"]
	}
	toggleDeletePrompt?: Function
	hideTags?: boolean
	hideHoverEffect?: boolean
}

export interface IUser {
	profile_picture: string
	name: string
	about: string
	dob?: Date
	gender?: string
	interests?: (mongoose.Schema.Types.ObjectId | string)[]
	private: boolean
	username: string
	email: string
	password: string
	followers: number
	created_at: Date
	new_user?: boolean
}

export interface ICollection {
	_id?: mongoose.Schema.Types.ObjectId | string
	user?: mongoose.Schema.Types.ObjectId | string
	name: string
	private: boolean
	created_at?: Date
	posts?: IPost[]
	recent_post?: Date
	total_posts?: number
}

export interface IReadingList {
	user: mongoose.Schema.Types.ObjectId | string
	posts: {
		post_id: mongoose.Schema.Types.ObjectId | string
		timestamp: Date
	}[]
}

export type ReadingListItem = {
	title: string
	content: string
	user: {
		name: string
		profile_picture: string
		username: string
	}
	post_id: string
	_id: string
	timestamp: Date
	timeString?: string
}

export type ReadingListType = {
	_id: string
	posts: ReadingListItem[]
}

export interface ITag {
	_id: mongoose.Schema.Types.ObjectId | string
	name: string
	parents?: (mongoose.Schema.Types.ObjectId | string)[]
}

export interface IPostLikes {
	post: mongoose.Schema.Types.ObjectId | string
	users: (mongoose.Schema.Types.ObjectId | string)[]
}

export interface IFollowing {
	user: mongoose.Schema.Types.ObjectId | string
	following: (mongoose.Schema.Types.ObjectId | string)[]
}

export interface IEditorProps {
	postContent: string
	setPostContent: Dispatch<SetStateAction<string>>
	title: string
	setTitle: Dispatch<SetStateAction<string>>
	updateInDB: (params: IPostSubmitParams & { reading_time: number }) => Promise<void>
}

export interface IReqParams {
	params: { [key: string]: string }
}

export interface IAuthReqParams {
	tokenJson: JwtPayload
	req_params?: IReqParams
	error?: string
}

export interface IPromptAction {
	handler: React.MouseEventHandler<HTMLButtonElement>
	label: string
	classname?: string
}
export interface IPromptParams {
	warning: string
	description: string
	actions: IPromptAction[]
	isOpen: boolean
	onClose: () => void
	children?: React.ReactNode
}

export interface IAuthPageProps {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
	session: Session | null
}

export interface IPostSubmitParams {
	private?: IPost["private"]
	user_collection?: IPost["user_collection"]
	newCollection?: ICollection
	tags: IPost["tags"]
}

export interface IVisibilityOption {
	Icon: IconType
	label: string
	value: boolean
}

export interface INewCollection {
	name?: string
	private?: IVisibilityOption
}

export interface IProfilePictureComponent {
	url: string
	editFile: () => void
	changeFile: () => void | undefined
	deleteFile: () => Promise<void>
}
