"use client"

import React, { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { IBlogCardProps, IPromptAction } from "@utils/types"
import axios from "axios"
import { BlogCard } from "@components"
import Overlay from "@components/Overlay"
import Prompt from "@components/Prompt"
import ImageCrop from "@components/ImageCrop"

const Profile = () => {
	const { data: session } = useSession()
	const [blogs, setBlogs] = useState<IBlogCardProps[]>([])
	const [promptState, setPromptState] = useState<{ description: string; action: IPromptAction } | null>(null)

	useEffect(() => {
		// @ts-ignore
		if (session?.session_token) {
			;(async () => {
				const response = await axios({
					method: "get",
					url: "/api/blogpost",
					// @ts-ignore
					headers: { Authorization: `Bearer ${session?.session_token}` }
				})
				setBlogs(response.data)
			})()
		}
	}, [session])

	const deleteBlogPost = async (blog_id: string) => {
		const response = await axios({
			method: "delete",
			url: `/api/blogpost/${blog_id}`,
			// @ts-ignore
			headers: { Authorization: `Bearer ${session?.session_token}` }
		})
	}
	const toggleDeletePrompt = (e: React.MouseEvent<HTMLButtonElement>, blog_title: string, blog_id: string) => {
		e.preventDefault()
		setPromptState({
			description: blog_title,
			action: { handler: () => deleteBlogPost(blog_id), label: "Yes, Delete", classname: "delete" }
		})
	}

	const [first, setFirst] = useState()
	const [selectedImage, setSelectedImage] = useState<{ file?: File; active?: boolean; url?: string } | null>()
	const inputRef = useRef<HTMLInputElement>(null)

	const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
		const file = e.target.files?.[0]
		let imageDataUrl = await new Promise(resolve => {
			const reader = new FileReader()
			reader.addEventListener("load", () => resolve(reader.result), false)
			reader.readAsDataURL(file as Blob)
		})

		setSelectedImage({
			active: true,
			url: imageDataUrl as string,
			file
		})
	}

	const uploadImage = async (blob: Blob) => {
		if (!selectedImage?.file) return
		const file = new File([blob], selectedImage.file.name, {
			type: selectedImage.file.type
		})

		const formData = new FormData()
		formData.append("type", "profile_picture")
		formData.append("file", file)

		const response = await axios.post("/api/upload", formData, {
			headers: {
				"Authorization": `Bearer ${session?.session_token}`,
				"Content-Type": "multipart/form-data"
			}
		})

		setSelectedImage(null)
		setFirst(response.data.file_url)
	}

	return (
		<div>
			{selectedImage?.active && (
				<ImageCrop
					src={selectedImage?.url as string}
					close={() => setSelectedImage(prev => ({ ...prev, active: false }))}
					uploadImage={uploadImage}
				/>
			)}
			<div className="flex items-center gap-20 pt-16 pb-[72px] px-10">
				<Image
					className="object-cover rounded-full aspect-square w-64 h-64 cursor-pointer"
					src={first || session?.user?.image || ""}
					alt="user"
					width={256}
					height={256}
					onClick={() => inputRef?.current?.click()}
				/>
				<input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} hidden />
				<div>
					<h2 className="font-playFD text-4xl mb-3 font-medium">{session?.user?.name}</h2>
					<p className="font-lora text-whiteSecondary">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis, tempora.
					</p>
					<div className="opacity-60 mt-6">
						<span className="pr-5 border-r border-[#7777777d]">{blogs?.length || 0} Published</span>
						<span className="pl-5">9 Saved</span>
					</div>
				</div>
			</div>
			<div>
				<button className="text-lg pb-3 highline mr-8">Blogposts</button>
				<button className="text-lg pb-3 highline mr-8">Journals</button>
				<button className="text-lg pb-3 opacity-60">Saved</button>
			</div>
			<div className="py-10">
				{blogs?.map(blog => (
					<BlogCard
						key={blog._id.toString()}
						{...blog}
						profile_view={true}
						toggleDeletePrompt={toggleDeletePrompt}
					/>
				))}
			</div>
			{promptState && (
				<Overlay>
					<Prompt
						warning="Delete Blogpost"
						description={promptState?.description}
						actions={[
							{ handler: () => setPromptState(null), label: "Cancel" },
							promptState?.action as IPromptAction
						]}
					/>
				</Overlay>
			)}
		</div>
	)
}

export default Profile
