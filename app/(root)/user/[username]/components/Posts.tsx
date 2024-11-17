"use client"

import { PostCard } from "@components"
import { IPost } from "@types"
import React from "react"

const Posts = ({
	posts,
	isAutherLoggedIn,
	onDelete
}: {
	posts: IPost[]
	isAutherLoggedIn: boolean
	onDelete: (postId: string) => void
}) => {
	return (
		<div className="ss:space-y-5">
			{posts?.map((post, index) => (
				<PostCard
					key={`${post?._id}:${index}`}
					{...post}
					profileView={true}
					userView={isAutherLoggedIn}
					onDelete={() => onDelete(post._id || "")}
				/>
			))}
		</div>
	)
}

export default Posts
