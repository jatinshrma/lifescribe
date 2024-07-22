import { Model, Schema } from "mongoose"
import createModel from "@helpers/createModel"
import { IAuthor } from "@types"

type AuthorModel = Model<IAuthor>

const AuthorSchema = new Schema<IAuthor, AuthorModel>({
	profile_picture: {
		type: String,
		unique: true
	},
	name: {
		type: String,
		required: false
	},
	about: {
		type: String
	},
	dob: {
		type: Date
	},
	gender: {
		type: String
	},
	private: {
		type: Boolean,
		default: () => false
	},
	interests: [
		{
			type: Schema.Types.ObjectId,
			ref: "tag"
		}
	],
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	new_user: {
		type: Boolean
	}
})

AuthorSchema.pre("save", function (next) {
	if (!this.username && this.email) {
		this.username = this.email.split("@")[0]
	}
	next()
})

export default createModel<IAuthor, AuthorModel>("Author", AuthorSchema)
