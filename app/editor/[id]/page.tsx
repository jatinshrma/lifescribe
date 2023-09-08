"use client"

import Editor from "@components/Editor"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"

const Edit = () => {
	const { id } = useParams()
	const { data: session } = useSession()
	const [title, setTitle] = useState("")
	const [blogContent, setBlogContent] = useState("")
	const blog_id = (id as string)?.split("--")[0]

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/blogpost/" + blog_id)
			setTitle(response.data.title)
			setBlogContent(response.data.content)
		})()
	}, [])

	const publish = async (reading_time: number) => {
		const response = await axios({
			method: "put",
			url: `/api/blogpost/${blog_id}`,
			// @ts-ignore
			headers: { Authorization: `Bearer ${session?.session_token}` },
			data: {
				title: title,
				content: blogContent,
				reading_time
			}
		})
	}

	return (
		<Editor blogContent={blogContent} setBlogContent={setBlogContent} title={title} setTitle={setTitle} updateInDB={publish} />
	)
}

export default Edit
