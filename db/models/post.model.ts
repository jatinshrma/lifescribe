import { Model, Schema } from "mongoose"
import createModel from "@helpers/createModel"
import { IPost } from "@types"

type PostModel = Model<IPost>

const PostSchema = new Schema<IPost, PostModel>({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	user_collection: {
		type: Schema.Types.ObjectId,
		ref: "users"
	},
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: "tags"
		}
	],
	likes: {
		type: Number,
		default: 0
	},
	private: {
		type: Boolean,
		default: () => false
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	reading_time: Number
})

export default createModel<IPost, PostModel>("Post", PostSchema)
