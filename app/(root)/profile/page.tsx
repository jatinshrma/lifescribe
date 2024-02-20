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
import { TbWorld } from "react-icons/tb"
import { FiLock } from "react-icons/fi"
import { BiBookmark } from "react-icons/bi"
import { AnyObject } from "mongoose"
import { RiArrowDropDownLine } from "react-icons/ri"
import { FaAngleDown } from "react-icons/fa6"
import { FaCaretDown } from "react-icons/fa"
import { BiSort } from "react-icons/bi"
import { CiSearch } from "react-icons/ci"
import { RiSearchLine } from "react-icons/ri"
import { BsCollection } from "react-icons/bs"
import { FiArrowLeft } from "react-icons/fi"

const tabs = [
	{ Icon: TbWorld, label: "Published" },
	{ Icon: FiLock, label: "Private" },
	{ Icon: BiBookmark, label: "Saved" }
]

const Profile = () => {
	const { data: session } = useSession()
	const [blogs, setBlogs] = useState<IBlogCardProps[]>([])
	const [promptState, setPromptState] = useState<{ description: string; action: IPromptAction } | null>(null)
	const [state, setState] = useState<AnyObject>({})

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
			<div className="flex items-center gap-20 pt-16 pb-[72px]">
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
					<h2 className="font-playFD text-5xl font-medium">{session?.user?.name}</h2>
					<p className="font-lora text-whiteSecondary my-6">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis, tempora.
					</p>
					<div className="opacity-60">
						<span className="pr-5 border-r border-[#7777777d]">{blogs?.length || 0} Published</span>
						<span className="px-5 border-r border-[#7777777d]">{blogs?.length || 0} Private</span>
						<span className="pl-5">9 Saved</span>
					</div>
				</div>
			</div>
			<div className="sticky top-0 bg-darkPrimary z-10">
				<div className="flex border-b border-darkSecondary text-opacity-100 relative">
					<div
						className={`absolute w-1/3 h-0.5 bg-whitePrimary bottom-0 left-0 transition-all duration-200 ease`}
						style={{ translate: `${(state?.currTab || 0) * 100}%` }}
					/>
					{tabs?.map((i, idx) => (
						<button
							onClick={() => setState(prev => ({ ...prev, currTab: idx }))}
							className={`text-lg py-5 flex gap-2 justify-center items-center w-1/3 ${
								state?.currTab === idx ? "" : "opacity-50"
							}`}
						>
							<i.Icon className="text-xl" />
							<span>{i.label}</span>
						</button>
					))}
				</div>
				<div className="flex my-5 justify-between">
					<div>
						{state?.blogs && (
							<button
								className="px-4 py-3 rounded-full flex items-center gap-2"
								onClick={() => setState(prev => ({ ...prev, blogs: false }))}
							>
								<FiArrowLeft className="text-lg" />
								<span>Back</span>
							</button>
						)}
					</div>
					<div className="flex items-stretch gap-4">
						<div className="bg-darkSecondary pl-4 py-2 pr-2 rounded-full flex items-center gap-4">
							<input type="text" placeholder="Search" className="w-full" />
							<button className="h-full aspect-square flex items-center justify-center rounded-full text-opacity-100 group hover:bg-whitePrimary transition-colors duration-300 ease">
								<RiSearchLine className="text-lg group-hover:fill-darkPrimary" />
							</button>
						</div>
						<button className="bg-darkSecondary px-4 py-3 rounded-full flex items-center gap-4">
							<span>Sort</span>
							<FaCaretDown className="text-sm" />
						</button>
						<button className="bg-darkSecondary px-4 py-3 rounded-full flex items-center gap-4">
							<span>Date</span>
							<FaCaretDown className="text-sm" />
						</button>
					</div>
				</div>
			</div>
			{!state?.blogs ? (
				<div>
					<div
						className="bg-darkSecondary rounded-[2rem] p-8 cursor-pointer my-5"
						onClick={() => setState(prev => ({ ...prev, blogs: true }))}
					>
						<div className="flex items-center gap-4">
							<BsCollection className="text-2xl" />
							<span className="text-sm opacity-60">March 23 2024</span>
						</div>
						<p className="my-5 text-3xl">
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias, nobis!
						</p>
						<div className="my-5 flex gap-2 items-center flex-wrap">
							<button className="text-sm border border-whiteSecondary text-opacity-20 px-4 py-2 rounded-full">
								Education
							</button>
							<button className="text-sm border border-whiteSecondary text-opacity-20 px-4 py-2 rounded-full">
								Fitness
							</button>
							<button className="text-sm border border-whiteSecondary text-opacity-20 px-4 py-2 rounded-full">
								Entrepreneurship
							</button>
							<span className="text-sm opacity-60">+3 More</span>
						</div>
						<div className="text-sm opacity-60 flex gap-3">
							<span>3 Posts</span>
							<span>·</span>
							<span>Last updated 19 April 2024</span>
						</div>
					</div>
				</div>
			) : (
				<div className="my-8">
					<h1 className="mb-14 text-4xl font-semibold">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, fugiat.
					</h1>
					{blogs?.map(blog => (
						<BlogCard
							key={blog._id.toString()}
							{...blog}
							profile_view={true}
							toggleDeletePrompt={toggleDeletePrompt}
						/>
					))}
				</div>
			)}
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
