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
		if (session)
			(async () => {
				const response = await axios.get("/api/blogpost/suggestions")
				if (response.data) {
					setBlogs(response?.data)
				}
			})()
	}, [session])

	return (
		<div className="px-5">
			{/* <div className="flex overflow-auto ss:my-6 my-2">
				{tags?.map(tag => (
					<button
					key={tag.toLowerCase()}
					className={`sm:text-base text-sm whitespace-nowrap mx-2.5 ss:py-4 py-3 first:ml-0 last:mr-0 border-b-[1px] ${
						tag === selected ? "opacity-100" : "opacity-40 border-transparent"
					}`}
					onClick={() => setSelected(tag)}
					>
					{tag}
					</button>
					))}
				</div> */}
			<div>
				{blogs?.map(blog => (
					<BlogCard key={blog._id.toString()} {...blog} />
				))}
			</div>
		</div>
	)
}
