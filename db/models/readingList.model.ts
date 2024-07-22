import { Model, Schema } from "mongoose"
import createModel from "@helpers/createModel"
import { IReadingList } from "@types"

type ReadingListModel = Model<IReadingList>

const ReadingListSchema = new Schema<IReadingList, ReadingListModel>({
	author: {
		type: Schema.Types.ObjectId,
		ref: "authors",
		unique: true
	},
	posts: [
		{
			post_id: {
				type: Schema.Types.ObjectId,
				ref: "posts",
				required: true
			},
			timestamp: {
				type: Date,
				default: () => Date.now()
			}
		}
	]
})

export default createModel<IReadingList, ReadingListModel>("reading_list", ReadingListSchema)
