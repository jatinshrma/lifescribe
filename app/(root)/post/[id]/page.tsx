"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IPost } from "@types"
import axios from "axios"

import "react-quill/dist/quill.bubble.css"
import ReactQuill from "@components/ReactQuill"
import LayoutWrapper from "@components/LayoutWrapper"

const Post = () => {
	const { id } = useParams()
	const [post, setPost] = useState<IPost>()

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/post/" + id)
			setPost(response.data)
		})()
	}, [])

	return (
		<LayoutWrapper>
			<div className="max-w-screen-sm mx-auto">
				{post && (
					<>
						<h1 className="post__title">{post?.title}</h1>
						<ReactQuill
							id="editor"
							theme="bubble"
							className="relative"
							readOnly={true}
							value={post?.content}
							placeholder="Content..."
						/>
					</>
				)}
			</div>
		</LayoutWrapper>
	)
}

export default Post
