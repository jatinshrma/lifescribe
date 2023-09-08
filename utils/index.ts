export const selectRandomIndexes = (totalCount: number, numIndexesToSelect: number) => {
	if (numIndexesToSelect > totalCount) {
		throw new Error("Number of indexes to select cannot be greater than the total count.")
	}

	const selectedIndexes = new Set()
	while (selectedIndexes.size < numIndexesToSelect) {
		selectedIndexes.add(Math.floor(Math.random() * totalCount))
	}

	return Array.from(selectedIndexes)
}

export const getRandomString = (len = 10) => [...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("")

export const mongoAggregations = {
	blogpost_fetch: [
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
		},
		{
			$lookup: {
				from: "authors",
				localField: "author",
				foreignField: "_id",
				as: "_author_"
			}
		},
		{
			$unwind: {
				path: "$_author_"
			}
		},
		{
			$addFields: {
				author: "$_author_.name",
				author_image: "$_author_.profile_picture"
			}
		}
	]
}
