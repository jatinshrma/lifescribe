"use client"

import axios from "axios"
import React, { useState, useMemo, useRef, Dispatch, SetStateAction, ComponentType, MutableRefObject } from "react"
import { TbCloudUpload } from "react-icons/tb"
import ReactQuill from "@components/ReactQuill"
import RQType from "react-quill"
import "react-quill/dist/quill.snow.css"
import { IEditorProps } from "@utils/types"

const Editor = ({ blogContent, setBlogContent, title, setTitle, updateInDB }: IEditorProps) => {
	const editorRef = useRef(null) as MutableRefObject<RQType> | MutableRefObject<null>

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
				fd.append("file", file)

				const config = { headers: { "content-type": "multipart/form-data" } }
				const response = await axios.post("/api/upload", fd, config)

				if (response.status !== 200) return
				const index = editorRef?.current?.getEditor()?.getSelection()?.index || 0
				editorRef?.current?.getEditor().insertEmbed(index, "image", response.data.file_url)
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

	const onChange = (e: { target: { style: { height: string }; scrollHeight: any; value: React.SetStateAction<string> } }) => {
		e.target.style.height = "auto"
		e.target.style.height = `${e.target.scrollHeight}px`
		setTitle(e.target.value)
	}

	const publish = async () => {
		const div = document.createElement("div")
		div.innerHTML = blogContent
		const words_count = Array.from(div.children, ({ textContent }) => textContent?.trim())
			.filter(Boolean)
			.join(" ").length
		const reading_time = Math.ceil(words_count / 200)
		await updateInDB(reading_time)
	}

	return (
		<div className="ss:px-0 px-4">
			<textarea rows={1} id="blog__editor-title" placeholder="Title" onChange={onChange} value={title} />
			<ReactQuill
				id="editor"
				className="relative"
				theme="snow"
				value={blogContent}
				onChange={setBlogContent}
				placeholder="Content..."
				modules={modules}
				forwardedRef={editorRef}
			/>
			<div>
				<button
					className="group flex items-center bg-whiteSecondary rounded-full p-3 w-fit fixed bottom-4 right-4 hover:gap-2"
					onClick={publish}
				>
					<TbCloudUpload className="text-2xl stroke-darkPrimary" />
					<span className="text-darkPrimary font-medium w-[1px] overflow-hidden transition-all duration-300 ease-in-out group-hover:w-[58px]">
						Publish
					</span>
				</button>
			</div>
		</div>
	)
}

export default Editor
