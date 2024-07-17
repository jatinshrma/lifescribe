import { JwtPayload } from "jsonwebtoken"
import mongoose, { Date } from "mongoose"
import { Session } from "next-auth"
import { BuiltInProviderType } from "next-auth/providers/index"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"
import { IconType } from "react-icons"

export interface IPost {
	title: string
	content: string
	author: mongoose.Schema.Types.ObjectId | string
	author_collection?: mongoose.Schema.Types.ObjectId | string
	visibility: number
	tags: string[]
	created_at: Date
	reading_time: number
}

export interface IPostCardProps {
	_id: mongoose.Schema.Types.ObjectId
	author?: {
		profile_picture: IAuthor["profile_picture"]
	}
	toggleDeletePrompt?: Function
	hideTags?: boolean
	hideHoverEffect?: boolean
}

export interface IAuthor {
	profile_picture: string
	name: string
	bio: string
	collections: ICollectionType[]
	saved_posts: string[]
	username: string
	email: string
	password: string
	created_at: Date
	new_user?: boolean
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
}

export interface IAuthPageProps {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
	session: Session | null
}

export interface IPostSubmitParams {
	visibility: IPost["visibility"]
	author_collection?: IPost["author_collection"]
	newCollection?: ICollectionType
	tags: IPost["tags"]
}

export interface ICollectionType {
	_id?: mongoose.Schema.Types.ObjectId | string
	name: string
	visibility: number
	created_at?: Date
}

export interface IVisibilityOption {
	Icon: IconType
	label: string
	value: number
}

export interface INewCollection {
	name?: string
	visibility?: IVisibilityOption
}
