import { Model, Schema } from "mongoose"
import { IFollowing } from "@types"
import createModel from "@helpers/createModel"

type FollowingModel = Model<IFollowing>

const FollowingSchema = new Schema<IFollowing, FollowingModel>({
	user: { type: Schema.Types.ObjectId, ref: "users", required: true, unique: true },
	following: [{ type: Schema.Types.ObjectId, ref: "users" }]
})

export default createModel<IFollowing, FollowingModel>("following", FollowingSchema)
