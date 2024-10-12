"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { calculateAge, getRedirectURL } from "@helpers/utils"
import { DeleteButton, SaveButton, ShareButton, ViewButton } from "./ActionButtons"
import { useSession } from "next-auth/react"

const PostCard = (props: any) => {
	const session = useSession()
	const router = useRouter()

	const viewButton = <ViewButton url={getRedirectURL(props?._id, props?.title)} />
	const shareButton = <ShareButton url={location.origin + getRedirectURL(props?._id, props?.title)} />
	const deleteButton = <DeleteButton postId={props?._id} onDelete={props?.onDelete} />
	const saveButton = (
		<SaveButton postId={props?._id} isAdded={props.inReadingList} onUpdate={props.onReadingListUpdate} />
	)

	return (
		<div className="border-t border-darkHighlight group first:border-transparent ss:hover:border-transparent ss:[&:hover+div]:border-transparent">
			<div
				className={`relative ss:p-8 py-6 group-hover:ss:bg-darkSecondary ss:rounded-5xl ss:transition ss:ease ss:duration-300`}
			>
				<Link href={getRedirectURL(props?._id, props?.title, props?.profileView && props.userView ? 2 : 1)}>
					<div className="flex ss:gap-2.5 gap-2 items-center">
						{!props?.profileView ? (
							<>
								<Image
									className={"rounded-full object-cover w-7 aspect-square"}
									src={props?.user?.profile_picture}
									alt="user"
									width={32}
									height={32}
								/>
								<div className="flex justify-between w-full">
									<div className="flex gap-2 items-center">
										<button onClick={() => router.push(`/user/${props?.user?.username}`)}>
											<span className="text-fontSecondary ss:text-base text-sm hover:underline">
												{props?.user?.name}
											</span>
										</button>
										<span className="opacity-60 ss:text-sm text-xs">·</span>
										<span className="opacity-60 ss:text-sm text-xs">{calculateAge(props?.created_at)}</span>
									</div>
									<div className="flex gap-5 items-center">
										{shareButton}
										{session?.data?.user && <>{saveButton}</>}
									</div>
								</div>
							</>
						) : (
							<div className="flex justify-between w-full">
								<div className="flex gap-3 items-center">
									<span className="opacity-60 ss:text-sm text-xs">{calculateAge(props?.created_at)}</span>
									<span className="opacity-60 ss:text-sm text-xs">·</span>
									<span className="opacity-60 ss:text-sm text-xs">{props?.reading_time} min read</span>
								</div>
								<div className="flex gap-5 items-center">
									{shareButton}
									{props?.userView ? (
										<>
											{viewButton}
											{deleteButton}
										</>
									) : session?.data?.user ? (
										saveButton
									) : null}
								</div>
							</div>
						)}
					</div>

					<h2 className="ss:text-[28px] ss:leading-9 text-lg ss:my-4 mt-3 font-medium">{props?.title}</h2>
					<div className="postcard_content">
						<p className="ss:text-lg text-base text-whiteSecondary">
							{props?.content?.replace(/<[^>]*(>|$)|||»|«|>/g, "")}
						</p>
					</div>

					{!props?.hideTags && (
						<div className="mt-4 flex gap-2 items-center flex-wrap">
							{props?.tags?.map((tag: string) => (
								<button className="theme-button outlined medium ss:text-sm text-xs text-opacity-20">{tag}</button>
							))}
						</div>
					)}
					{!props?.profileView && (
						<span className="mt-4 block opacity-60 ss:text-sm text-xs">{props?.reading_time} min read</span>
					)}
				</Link>
			</div>
		</div>
	)
}

export default PostCard
