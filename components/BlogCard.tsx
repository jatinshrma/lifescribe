"use client"

import React from "react"
import Image from "next/image"
import { IBlogCardProps } from "@utils/types/index"
import Link from "next/link"

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
	const getRedirectURL = () => {
		const blog_id = `${props?._id}--${props?.title?.replaceAll(" ", "-")?.replaceAll("#", "")?.toLowerCase()}`
		if (props?.profile_view) return `/editor/${blog_id}`
		else return `/${blog_id}`
	}

	return (
		<div className="ss:py-8 py-6">
			<Link href={getRedirectURL()}>
				<div className="flex ss:gap-2.5 gap-2 items-center">
					{!props?.profile_view ? (
						<>
							<Image
								className={"rounded-full object-cover sm:w-[22px] w-[18px]"}
								src={props?.author_image}
								alt="user"
								width={32}
								height={32}
							/>
							<div className="flex gap-2 items-center">
								<span className="text-fontSecondary sm:text-base text-sm">{props?.author?.toString()}</span>
								<span className="opacity-60 sm:text-sm text-xs">·</span>
								<span className="opacity-60 sm:text-sm text-xs">{calculateAge(props?.created_at)}</span>
							</div>
						</>
					) : (
						<div className="flex gap-2 items-center">
							<span className="opacity-60 sm:text-sm text-xs">{calculateAge(props?.created_at)}</span>
							<span className="opacity-60 sm:text-sm text-xs">·</span>
							<span className="opacity-60 ss:text-sm text-xs">{props?.reading_time} min read</span>
						</div>
					)}
				</div>
				<h2 className="ss:text-[28px] ss:leading-9 text-xl ss:my-4 mt-3.5 mb-2.5 font-medium">{props?.title}</h2>
				<div className="blogcard_content">
					<p className="text-lg">{props?.content?.replace(/<[^>]*(>|$)|||»|«|>/g, "")}</p>
				</div>
				<p className="mt-6 ss:text-base text-xs ">
					{props?.tags?.[0] && (
						<span>
							#<span className="underline ss:mr-4 mr-2">{props?.tags?.join(", ")}</span>
						</span>
					)}
					{!props?.profile_view && <span className="opacity-60 ss:text-sm">{props?.reading_time} min read</span>}
				</p>
			</Link>
		</div>
	)
}

export default BlogCard
