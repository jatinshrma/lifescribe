"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { BiShare, BiShowAlt, BiTrash } from "react-icons/bi"
import { BsEye } from "react-icons/bs"
import { FiBookmark } from "react-icons/fi"
import { HiOutlineEye } from "react-icons/hi2"
import { FaRegEye } from "react-icons/fa6"
import { MdBookmarkBorder } from "react-icons/md"
import { LuBookmark } from "react-icons/lu"

const PostCard = (props: any) => {
	const calculateAge = (dateString: Date) => {
		const units = ["day", "hour", "minute", "second"]
		const divisors = [86400000, 3600000, 60000, 1000]

		const elapsedDate = new Date(dateString)
		const elapsed = Date.now() - elapsedDate.getTime()

		if (elapsed >= divisors[0]) {
			const month = elapsedDate.toLocaleString("default", { month: "short" })
			const day = elapsedDate.getDate()
			return `${month} ${day}`
		}

		for (let i = 0; i < divisors.length; i++) {
			let value = Math.floor(elapsed / divisors[i])
			if (value >= 1) {
				return `${value} ${units[i]}${value !== 1 ? "s" : ""} ago`
			}
		}

		return "Just now"
	}

	const getRedirectURL = (url_type: number = 1) => {
		if (url_type === 1)
			return `/post/${props?._id}?title=${props?.title?.replaceAll(" ", "-")?.replaceAll("#", "")?.toLowerCase()}`
		else return `/editor?id=${props?._id}`
	}

	const copyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		navigator.clipboard.writeText(location.origin + getRedirectURL())
	}

	const shareButton = (
		<button onClick={copyLink} className="hover:scale-125 transition-transform ease-linear">
			<BiShare className="hover:fill-blue-500 text-2xl" />
		</button>
	)
	const viewButton = (
		<button className="hover:scale-125 transition-transform ease-linear">
			<Link href={getRedirectURL()}>
				<FaRegEye className="hover:fill-amber-500 text-2xl" />
			</Link>
		</button>
	)
	const deleteButton = (
		<button
			onClick={e => props?.toggleDeletePrompt?.(e, props?.title, props?._id)}
			className="hover:scale-125 transition-transform ease-linear"
		>
			<AiOutlineDelete className="hover:fill-red-500 text-2xl" />
		</button>
	)
	const saveButton = (
		<button className="hover:scale-125 transition-transform ease-linear">
			<LuBookmark className="hover:stroke-yellow-500 text-2xl" />
		</button>
	)

	return (
		<div className="border-t border-darkHighlight group first:border-transparent hover:border-transparent [&:hover+div]:border-transparent">
			<div className={`relative p-8 group-hover:bg-darkSecondary transition ease duration-300 rounded-5xl`}>
				<Link href={getRedirectURL(props?.profileView && props.authorView ? 2 : 1)}>
					<div className="flex ss:gap-2.5 gap-2 items-center">
						{!props?.profileView ? (
							<>
								<Image
									className={"rounded-full object-cover w-6"}
									src={props?.author?.profile_picture}
									alt="user"
									width={32}
									height={32}
								/>
								<div className="flex justify-between w-full">
									<div className="flex gap-2 items-center">
										<Link href={`/author/${props?.author?.username}`}>
											<span className="text-fontSecondary text-base hover:underline">{props?.author?.name}</span>
										</Link>
										<span className="opacity-60 text-sm">·</span>
										<span className="opacity-60 text-sm">{calculateAge(props?.created_at)}</span>
									</div>
									<div className="flex gap-5 items-center">
										{shareButton}
										{saveButton}
									</div>
								</div>
							</>
						) : (
							<div className="flex justify-between w-full">
								<div className="flex gap-3 items-center">
									<span className="opacity-60 text-sm">{calculateAge(props?.created_at)}</span>
									<span className="opacity-60 text-sm">·</span>
									<span className="opacity-60 text-sm">{props?.reading_time} min read</span>
								</div>
								<div className="flex gap-5 items-center">
									{shareButton}
									{props?.authorView ? (
										<>
											{viewButton}
											{deleteButton}
										</>
									) : (
										saveButton
									)}
								</div>
							</div>
						)}
					</div>

					<h2 className="ss:text-[28px] ss:leading-9 text-xl ss:my-4 mt-3.5 mb-2.5 font-medium">{props?.title}</h2>
					<div className="postcard_content">
						<p className="text-lg text-whiteSecondary">{props?.content?.replace(/<[^>]*(>|$)|||»|«|>/g, "")}</p>
					</div>

					{!props?.hideTags && (
						<div className="mt-4 flex gap-2 items-center flex-wrap">
							{props?.tags?.map((tag: string) => (
								<button className="theme-button outlined medium text-sm text-opacity-20">{tag}</button>
							))}
						</div>
					)}
					{!props?.profileView && (
						<span className="mt-4 block opacity-60 text-sm">{props?.reading_time} min read</span>
					)}
				</Link>
			</div>
		</div>
	)
}

export default PostCard
