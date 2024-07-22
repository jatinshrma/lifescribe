import { Model, Schema } from "mongoose"
import { ICollection } from "@types"
import createModel from "@helpers/createModel"

type CollectionModel = Model<ICollection>

const CollectionSchema = new Schema<ICollection, CollectionModel>({
	author: {
		type: Schema.Types.ObjectId,
		ref: "authors"
	},
	name: {
		type: String,
		required: false,
		unique: true
	},
	private: {
		type: Boolean,
		default: () => false
	},
	created_at: {
		type: Date,
		default: Date.now
	}
})

export default createModel<ICollection, CollectionModel>("collection", CollectionSchema)
