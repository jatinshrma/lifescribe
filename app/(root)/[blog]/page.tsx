"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IBlogPost } from "@utils/types"
import axios from "axios"

import "react-quill/dist/quill.bubble.css"
import ReactQuill from "@components/ReactQuill"

const Blog = () => {
	const { blog } = useParams()
	const [blogPost, setBlogPost] = useState<IBlogPost>()

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/blogpost/" + (blog as string)?.split("--")[0])
			setBlogPost(response.data)
		})()
	}, [])

	return (
		<div className="px-5">
			{blogPost && (
				<>
					<h1 className="blog__title">{blogPost?.title}</h1>
					<ReactQuill
						id="editor"
						theme="bubble"
						className="relative"
						readOnly={true}
						value={blogPost?.content}
						placeholder="Content..."
					/>
				</>
			)}
		</div>
	)
}

export default Blog
