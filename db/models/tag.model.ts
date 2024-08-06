import { Model, Schema } from "mongoose"
import { ITag } from "@types"
import createModel from "@helpers/createModel"

type TagModel = Model<ITag>

const TagSchema = new Schema<ITag, TagModel>({
	name: { type: String, required: true, unique: true },
	parents: [{ type: Schema.Types.ObjectId, ref: "tags" }]
})

export default createModel<ITag, TagModel>("Tag", TagSchema)
