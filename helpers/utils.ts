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

export const getRandomString = (len = 10) =>
	[...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("")

export const mongoAggregations = {
	post_fetch: [
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
				pipeline: [
					{
						$project: {
							username: 1,
							collections: 1,
							profile_picture: 1,
							name: 1
						}
					}
				],
				as: "_author_"
			}
		},
		{
			$set: {
				visibility: {
					$ifNull: [
						"$visibility",
						{
							$first: {
								$map: {
									input: {
										$filter: {
											input: {
												$first: "$_author_.collections"
											},
											as: "coll",
											cond: {
												$eq: ["$$coll._id", "$author_collection"]
											}
										}
									},
									as: "filteredColl",
									in: "$$filteredColl.visibility"
								}
							}
						}
					]
				},
				author: {
					username: {
						$first: "$_author_.username"
					},
					name: {
						$first: "$_author_.name"
					},
					profile_picture: {
						$first: "$_author_.profile_picture"
					}
				}
			}
		},
		{
			$unset: "_author_"
		},
		{
			$sort: {
				created_at: -1
			}
		}
	]
}
