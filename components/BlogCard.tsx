"use client"

import React from "react"
import Image from "next/image"
import { IBlogCardProps } from "@utils/types/index"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { BiShare } from "react-icons/bi"
import { GoBookmark } from "react-icons/go"
import { BsEye } from "react-icons/bs"
import { FiBookmark } from "react-icons/fi"

const BlogCard = (props: IBlogCardProps) => {
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
		const blog_id = `${props?._id}--${props?.title?.replaceAll(" ", "-")?.replaceAll("#", "")?.toLowerCase()}`
		if (url_type === 1) return `/${blog_id}`
		else return `/editor/${blog_id}`
	}
	const copyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		navigator.clipboard.writeText(location.origin + getRedirectURL())
	}

	return (
		<>
			<div className={`blog-card relative p-8 hover:bg-darkSecondary transition ease duration-300 rounded-5xl`}>
				<Link href={getRedirectURL(props?.profile_view ? 2 : 1)}>
					<div className="flex ss:gap-2.5 gap-2 items-center">
						{!props?.profile_view ? (
							<>
								<Image
									className={"rounded-full object-cover w-6"}
									src="/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
									// src={props?.author_image}
									alt="user"
									width={32}
									height={32}
								/>
								<div className="flex justify-between w-full">
									<div className="flex gap-2 items-center">
										<span className="text-fontSecondary text-base">{props?.author?.toString()}</span>
										<span className="opacity-60 text-sm">·</span>
										<span className="opacity-60 text-sm">{calculateAge(props?.created_at)}</span>
									</div>
									<div className="flex gap-5 items-center">
										<button onClick={copyLink}>
											<BiShare className="hover:fill-blue-500" style={{ transform: "rotateY(180deg)" }} />
										</button>
										<button>
											<FiBookmark className="text-[22px] hover:stroke-yellow-500" />
										</button>
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
									<button onClick={copyLink}>
										<BiShare className="hover:fill-blue-500" />
									</button>
									<button>
										<Link href={getRedirectURL()}>
											<BsEye className="hover:fill-amber-500" />
										</Link>
									</button>
									<button onClick={e => props?.toggleDeletePrompt?.(e, props?.title, props?._id)}>
										<AiOutlineDelete className="hover:fill-red-500" />
									</button>
								</div>
							</div>
						)}
					</div>
					<h2 className="ss:text-[28px] ss:leading-9 text-xl ss:my-4 mt-3.5 mb-2.5 font-medium">{props?.title}</h2>
					<div className="blogcard_content">
						<p className="text-lg text-whiteSecondary">{props?.content?.replace(/<[^>]*(>|$)|||»|«|>/g, "")}</p>
					</div>
					{!props?.hideTags && (
						<div className="mt-4 flex gap-2 items-center flex-wrap">
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
					)}
					{!props?.profile_view && (
						<span className="mt-4 block opacity-60 text-sm">{props?.reading_time} min read</span>
					)}
				</Link>
			</div>
		</>
	)
}

export default BlogCard
