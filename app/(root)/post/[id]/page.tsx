"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IPost } from "@types"
import axios from "axios"

import "react-quill/dist/quill.bubble.css"
import ReactQuill from "@components/ReactQuill"
import LayoutWrapper from "@components/LayoutWrapper"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import Image from "next/image"
import Link from "next/link"
import { DeleteButton, EditButton, SaveButton, ShareButton } from "@components/ActionButtons"
import { calculateAge, getRedirectURL } from "@helpers/utils"
import { useSession } from "next-auth/react"

const Post = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { id } = useParams()
	const [post, setPost] = useState<IPost>()
	const [author, setAuthor] = useState({})

	useEffect(() => {
		if (session?.user?.name || session === null)
			(async () => {
				const response = await axios.get("/api/post/" + id)
				if (response.data) {
					const { user, user_collection, ...postData } = response.data
					setPost(postData)
					setAuthor({
						...user,
						user_collection,
						isUserLoggedIn: user.username === session?.user?.username
					})
				}
			})()
	}, [session])

	const handleLike = async () => {
		try {
			const response = await axios.put(`/api/post/${id}/like`)
			if (response.data.success) {
				setPost(prev => ({
					...(prev as IPost),
					isLiked: response.data.isLiked
				}))
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleFollow = async () => {
		try {
			const response = await axios.put(`/api/user/following`, {
				username: author?.username
			})
			if (response.data.success) {
				setAuthor(prev => ({
					...prev,
					isFollowed: response.data.isFollowed,
					followers: (prev.followers || 0) + (response.data.isFollowed ? 1 : -1)
				}))
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<LayoutWrapper>
			<div className="max-w-screen-sm mx-auto">
				{post && (
					<>
						<h1 className="post__title mb-0">{post?.title}</h1>
						<div className="mt-8 mb-5 flex gap-4">
							<Image
								className={"rounded-full object-cover w-12 aspect-square"}
								src={author?.profile_picture}
								alt="user"
								width={32}
								height={32}
							/>
							<div className="flex justify-between w-full">
								<div>
									<div className="flex items-center gap-2">
										<Link href={`/user/${author?.username}`}>
											<span className="text-fontSecondary text-base hover:underline">{author?.name}</span>
										</Link>
										<span className="opacity-60 text-sm">·</span>
										<span className="opacity-60 text-sm">{author?.followers || 0} Followers</span>
									</div>
									<div className="flex items-center gap-2">
										{author?.user_collection?.name && (
											<>
												<span>
													<span className="opacity-60 text-sm">From collection</span>{" "}
													<Link href={"#"} className="text-base hover:underline">
														{author?.user_collection?.name}
													</Link>
												</span>
												<span className="opacity-60 text-sm">·</span>
											</>
										)}
										<span className="opacity-60 text-sm">{post?.reading_time} min read</span>
										<span className="opacity-60 text-sm">·</span>
										<span className="opacity-60 text-sm">{calculateAge(post?.created_at)}</span>
									</div>
								</div>

								<div className="flex items-center gap-6">
									{author?.isUserLoggedIn ? (
										<>
											<EditButton url={`/editor?id=${post?._id}`} />
											<DeleteButton postId={post?._id} onDelete={() => router.back()} />
										</>
									) : (
										<>
											<button
												className="theme-button primary medium !bg-darkHighlight hover:!bg-whitePrimary text-opacity-100 hover:text-black"
												onClick={handleFollow}
											>
												Follow{author?.isFollowed ? "ed" : ""}
											</button>
											<ShareButton url={location.origin + getRedirectURL(post?._id, post?.title)} />
											<SaveButton
												postId={post?._id}
												isAdded={post?.inReadingList}
												onUpdate={status =>
													setPost(prev => ({
														...(prev as IPost),
														inReadingList: status
													}))
												}
											/>
										</>
									)}
								</div>
							</div>
						</div>
						<ReactQuill
							id="editor"
							theme="bubble"
							className="relative"
							readOnly={true}
							value={post?.content}
							placeholder="Content..."
						/>
					</>
				)}

				{author?.username && !author?.isUserLoggedIn && (
					<div className="space-x-4">
						<button className="theme-button primary" onClick={handleLike}>
							{post?.isLiked ? (
								<>
									<AiFillLike className="text-xl" />
									Liked
								</>
							) : (
								<>
									<AiOutlineLike className="text-xl" />
									Like
								</>
							)}
						</button>
					</div>
				)}
			</div>
		</LayoutWrapper>
	)
}

export default Post
