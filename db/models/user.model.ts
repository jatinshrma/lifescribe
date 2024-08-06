import { Model, Schema } from "mongoose"
import createModel from "@helpers/createModel"
import { IUser } from "@types"

type UserModel = Model<IUser>

const UserSchema = new Schema<IUser, UserModel>({
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
	followers: {
		type: Number,
		default: 0
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	new_user: {
		type: Boolean
	}
})

UserSchema.pre("save", function (next) {
	if (!this.username && this.email) {
		this.username = this.email.split("@")[0]
	}
	next()
})

export default createModel<IUser, UserModel>("User", UserSchema)
