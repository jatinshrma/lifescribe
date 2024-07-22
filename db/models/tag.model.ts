import { Model, Schema } from "mongoose"
import { ITag } from "@types"
import createModel from "@helpers/createModel"

type TagModel = Model<ITag>

const TagSchema = new Schema<ITag, TagModel>({
	name: { type: String, required: true, unique: true },
	parent: { type: Schema.Types.ObjectId, ref: "tags", default: null }
})

export default createModel<ITag, TagModel>("Tag", TagSchema)
