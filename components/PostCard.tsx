"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { calculateAge, getRedirectURL } from "@helpers/utils"
import { DeleteButton, SaveButton, ShareButton, ViewButton } from "./ActionButtons"

const PostCard = (props: any) => {
	const router = useRouter()

	const viewButton = <ViewButton url={getRedirectURL(props?._id, props?.title)} />
	const shareButton = <ShareButton url={location.origin + getRedirectURL(props?._id, props?.title)} />
	const deleteButton = <DeleteButton postId={props?._id} onDelete={props?.onDelete} />
	const saveButton = (
		<SaveButton postId={props?._id} isAdded={props.inReadingList} onUpdate={props.onReadingListUpdate} />
	)

	return (
		<div className="border-t border-darkHighlight group first:border-transparent hover:border-transparent [&:hover+div]:border-transparent">
			<div className={`relative p-8 group-hover:bg-darkSecondary transition ease duration-300 rounded-5xl`}>
				<Link href={getRedirectURL(props?._id, props?.title, props?.profileView && props.userView ? 2 : 1)}>
					<div className="flex ss:gap-2.5 gap-2 items-center">
						{!props?.profileView ? (
							<>
								<Image
									className={"rounded-full object-cover w-6 aspect-square"}
									src={props?.user?.profile_picture}
									alt="user"
									width={32}
									height={32}
								/>
								<div className="flex justify-between w-full">
									<div className="flex gap-2 items-center">
										<button onClick={() => router.push(`/user/${props?.user?.username}`)}>
											<span className="text-fontSecondary text-base hover:underline">{props?.user?.name}</span>
										</button>
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
									{props?.userView ? (
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
