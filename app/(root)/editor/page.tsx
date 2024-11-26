"use client"

import { useSearchParams } from "next/navigation"

import axios from "axios"
import React, { useState, useEffect, useMemo, useRef, MutableRefObject, Suspense } from "react"
import { TbUpload } from "react-icons/tb"
import ReactQuill from "@components/ReactQuill"
import RQType from "react-quill"
import "react-quill/dist/quill.snow.css"
import { IPost, IPostSubmitParams } from "@types"
import LayoutWrapper from "@components/LayoutWrapper"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import PostSettings from "./components/PostSettings"

const EditorComponent = () => {
	const searchParams = useSearchParams()
	const [post, setPost] = useState<IPost | null>(null)
	const router = useRouter()
	const postId = searchParams.get("id")

	const editorRef = useRef(null) as MutableRefObject<RQType> | MutableRefObject<null>
	const [flags, setFlags] = useState<{
		contentLoading?: boolean
		publishing?: boolean
		state?: number
	}>({ state: 0 })

	useEffect(() => {
		if (postId)
			(async () => {
				const response = await axios.get("/api/post/" + postId, {
					params: {
						basic: 1
					}
				})
				setPost(response.data)
			})()
	}, [postId])

	const imageHandler = () => {
		const input = document.createElement("input")
		input.setAttribute("type", "file")
		input.setAttribute("accept", "image/*")
		input.click()
		input.onchange = async () => {
			try {
				const file = input?.files?.[0]
				if (!file) return
				if (!/^image\//.test(file.type)) return console.warn("You could only upload images.")

				const fd = new FormData()
				fd.append("type", "blog_image")
				fd.append("file", file)

				const config = { headers: { "content-type": "multipart/form-data" } }
				const response = await axios.post("/api/upload", fd, config)

				if (response.status !== 200) return
				const index = editorRef?.current?.getEditor()?.getSelection()?.index || 0
				editorRef?.current?.getEditor().insertEmbed(index, "image", response.data.url)
			} catch (error) {
				console.error("Error occurred in uploading image:", error)
			}
		}
	}

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					["bold", "italic", "underline"],
					[{ header: 2 }],
					[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
					[{ align: [] }],
					["link", "image", "blockquote", "code-block"]
				],
				handlers: {
					image: imageHandler
				}
			}
		}),
		[]
	)

	const onChange = (e: {
		target: { style: { height: string }; scrollHeight: any; value: React.SetStateAction<string> }
	}) => {
		e.target.style.height = "auto"
		e.target.style.height = `${e.target.scrollHeight}px`
		setPost(prev => ({ ...prev, title: e.target.value } as IPost))
	}

	const submitHandler = async (params: IPostSubmitParams) => {
		try {
			setFlags(prev => ({ ...prev, publishing: true }))

			const div = document.createElement("div")
			if (post?.content) div.innerHTML = post.content

			const words_count = Array.from(div.children, ({ textContent }) => textContent?.trim())
				.filter(Boolean)
				.join(" ").length

			const response = await axios({
				method: postId ? "PUT" : "POST",
				url: "/api/post",
				data: {
					postId: postId,
					title: post?.title,
					content: post?.content,
					reading_time: Math.ceil(words_count / 200),
					...params
				}
			})

			const _postId = response.data.postId || postId
			if (_postId) {
				toast.success("Saved your post successfully!")
				router.push(`/post/${_postId}?title=${post?.title?.replaceAll(" ", "-")}`)
			}
		} catch (error) {
			setFlags(prev => ({ ...prev, publishing: false }))
		}
	}

	const publishAllow = post && post.title?.length > 3 && post.content?.length > 3

	return (
		<LayoutWrapper
			navActions={
				flags?.state === 0 && (
					<button
						disabled={!publishAllow}
						className={
							"theme-button text-opacity-100 font-medium " +
							(publishAllow ? "primary" : "opacity-60 outlined pointer-events-none")
						}
						onClick={() => setFlags(prev => ({ state: +Boolean(!prev.state) }))}
					>
						<TbUpload />
						<span className="text-sm">Publish</span>
					</button>
				)
			}
		>
			<div>
				{flags?.state === 0 ? (
					<div className="max-w-screen-sm mx-auto">
						<textarea
							rows={1}
							id="post__editor-title"
							placeholder="Title"
							value={post?.title}
							onChange={onChange}
						/>
						<ReactQuill
							id="editor"
							className="relative"
							theme="snow"
							value={post?.content || ""}
							onChange={text => setPost(prev => ({ ...prev, content: text } as IPost))}
							placeholder="Content..."
							modules={modules}
							forwardedRef={editorRef}
						/>
					</div>
				) : flags?.state === 1 ? (
					<PostSettings
						goBack={() => setFlags({ state: 0 })}
						isPublishing={Boolean(flags?.publishing)}
						submit={submitHandler}
						post={post}
					/>
				) : null}
			</div>
		</LayoutWrapper>
	)
}

export default function Editor() {
	return (
		<Suspense>
			<EditorComponent />
		</Suspense>
	)
}
