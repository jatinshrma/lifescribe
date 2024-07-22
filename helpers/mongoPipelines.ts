import mongoose from "mongoose"

export const postsRegexPipeline = [
	{
		$addFields: {
			content: {
				$substr: ["$content", 0, 400]
			},
			regexResObject: {
				$regexFindAll: {
					input: "$content",
					regex: "<[^>]*(>|$)|||»|«|>"
				}
			}
		}
	},
	{
		$addFields: {
			content: {
				$reduce: {
					input: "$regexResObject",
					initialValue: "$content",
					in: {
						$replaceAll: {
							input: "$$value",
							find: "$$this.match",
							replacement: ""
						}
					}
				}
			}
		}
	},
	{
		$project: {
			regexResObject: 0
		}
	}
]

export const postsAutherDetails = [
	{
		$lookup: {
			from: "authors",
			localField: "author",
			foreignField: "_id",
			pipeline: [
				{
					$project: {
						name: 1,
						profile_picture: 1,
						username: 1
					}
				}
			],
			as: "_author_"
		}
	},
	{
		$set: {
			author: {
				name: {
					$first: "$_author_.name"
				},
				profile_picture: {
					$first: "$_author_.profile_picture"
				},
				username: {
					$first: "$_author_.username"
				}
			}
		}
	},
	{
		$unset: "_author_"
	}
]

export const postsCheckReadingList = (user_id: mongoose.Types.ObjectId) => [
	{
		$lookup: {
			from: "reading_lists",
			let: { postId: "$_id" },
			pipeline: [
				{
					$match: {
						author: user_id
					}
				},
				{
					$match: {
						$expr: { $in: ["$$postId", "$posts.post_id"] }
					}
				}
			],
			as: "reading_list_info"
		}
	},
	{
		$addFields: {
			in_reading_list: {
				$cond: {
					if: {
						$gt: [{ $size: "$reading_list_info" }, 0]
					},
					then: true,
					else: false
				}
			}
		}
	},
	{
		$project: {
			reading_list_info: 0
		}
	}
]
