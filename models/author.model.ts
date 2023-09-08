import { Model, Schema } from "mongoose"
import createModel from "@lib/createModel"
import { IAuthor } from "@utils/types"

type AuthorModel = Model<IAuthor>

const AuthorSchema = new Schema<IAuthor, AuthorModel>({
	profile_picture: {
		type: String,
		unique: true
	},
	name: {
		type: String,
		required: false,
		unique: true
	},
	bio: {
		type: String
	},
	saved_posts: [
		{
			type: String
		}
	],
	email: {
		type: String,
		required: true,
		unique: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
})

export default createModel<IAuthor, AuthorModel>("Author", AuthorSchema)
