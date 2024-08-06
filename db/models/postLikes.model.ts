import { Model, Schema } from "mongoose"
import { IPostLikes } from "@types"
import createModel from "@helpers/createModel"

type PostLikesModel = Model<IPostLikes>

const TagSchema = new Schema<IPostLikes, PostLikesModel>({
	post: { type: Schema.Types.ObjectId, ref: "posts", required: true, unique: true },
	users: [{ type: Schema.Types.ObjectId, ref: "users" }]
})

export default createModel<IPostLikes, PostLikesModel>("post_like", TagSchema)
