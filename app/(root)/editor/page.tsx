"use client"

import axios from "axios"
import React, { useState } from "react"
import { useSession } from "next-auth/react"
import Editor from "@components/Editor"

const Create = () => {
	const { data: session } = useSession()
	const [title, setTitle] = useState("")
	const [blogContent, setBlogContent] = useState("")

	const publish = async (reading_time: number) => {
		const response = await axios({
			method: "post",
			url: "/api/blogpost",
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

export default Create
