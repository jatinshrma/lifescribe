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
	author: {
		type: Schema.Types.ObjectId,
		ref: "authors",
		required: true
	},
	author_collection: {
		type: Schema.Types.ObjectId,
		ref: "authors"
	},
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: "tags"
		}
	],
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
