"use client"

import { PostCard } from "@components"
import { PostSkeleton } from "@components/Skeleton"
import { ReadingListItem } from "@types"
import React, { useEffect, useState } from "react"

const ReadingList = ({
	readingList,
	update,
	loadReadingList
}: {
	readingList?: ReadingListItem[]
	loadReadingList: () => Promise<void>
	update: (post_id: string, status: boolean) => void
}) => {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			setLoading(true)
			try {
				if (!readingList?.length) await loadReadingList()
			} catch (error) {}
			setLoading(false)
		})()
	}, [readingList?.length])

	if (loading)
		return (
			<div>
				<PostSkeleton />
				<PostSkeleton />
			</div>
		)
	return (
		<div className="ss:space-y-5">
			{readingList?.map((post, index) => (
				<PostCard
					key={`${post?.post_id}:${index}`}
					{...post}
					inReadingList={true}
					onReadingListUpdate={(status: boolean) => update(post?.post_id as string, status)}
				/>
			))}
		</div>
	)
}

export default ReadingList
