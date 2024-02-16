"use client"

import { BlogCard } from "@components/index"
import { IBlogCardProps } from "@utils/types"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
	const { data: session } = useSession()
	const [blogs, setBlogs] = useState<IBlogCardProps[]>([])

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/blogpost/suggestions")
			if (response.data) {
				setBlogs(response?.data)
			}
		})()
	}, [])

	return (
		<div className="px-5">
			<div>
				{blogs?.map(blog => (
					<BlogCard key={blog._id.toString()} {...blog} />
				))}
			</div>
		</div>
	)
}
