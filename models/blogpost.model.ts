import { Model, Schema } from "mongoose"
import createModel from "@lib/createModel"
import { getRandomString } from "@utils"
import { IBlogPost } from "@utils/types"

type BlogPostModel = Model<IBlogPost>

const BlogPostSchema = new Schema<IBlogPost, BlogPostModel>({
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
		ref: "BlogPost",
		required: true
	},
	tags: [
		{
			type: String
		}
	],
	created_at: {
		type: Date,
		default: Date.now
	},
	reading_time: Number
})

export default createModel<IBlogPost, BlogPostModel>("BlogPost", BlogPostSchema)
