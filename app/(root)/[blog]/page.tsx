"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { IBlogCardProps, IBlogPost } from "@utils/types"

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
		<div className="blog px-5">
			{blogPost && (
				<>
					<h1 className="blog__title">{blogPost?.title}</h1>
					<div dangerouslySetInnerHTML={{ __html: blogPost?.content }} />
				</>
			)}
		</div>
	)
}

export default Blog
