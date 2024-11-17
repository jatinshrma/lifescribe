"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { IPost, IUser } from "@types"
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
import { BlogSkeleton } from "@components/Skeleton"
import Button from "@components/Button"

type PostAuthor = {
	profile_picture: Pick<IUser, "profile_picture"> | string
	name: Pick<IUser, "name">
	username: Pick<IUser, "username">
	isFollowed: boolean
	followers: number
	isUserLoggedIn: boolean
	user_collection: {
		name: string
	}
}

const Post = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { id } = useParams()
	const [post, setPost] = useState<IPost>()
	const [author, setAuthor] = useState<PostAuthor | null>(null)
	const [flags, setFlags] = useState<{
		contentLoading?: boolean
		likeLoading?: boolean
		followLoading?: boolean
	}>({ contentLoading: true })

	useEffect(() => {
		if (session?.user?.name || session === null)
			(async () => {
				try {
					const response = await axios.get("/api/post/" + id)
					if (response.data) {
						const { user, user_collection, ...postData } = response.data
						setPost(postData)
						setAuthor({
							...user,
							user_collection,
							isUserLoggedIn: Boolean(session?.user?.username && user.username === session?.user?.username)
						})
					}
				} catch (error) {}
				setFlags({})
			})()
	}, [session])

	const handleLike = async () => {
		try {
			setFlags({ likeLoading: true })

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
		setFlags({})
	}

	const handleFollow = async () => {
		try {
			setFlags({ followLoading: true })
			const response = await axios.put(`/api/user/following`, {
				username: author?.username
			})
			if (response.data.success) {
				setAuthor(
					prev =>
						({
							...prev,
							isFollowed: response.data.isFollowed,
							followers: (prev?.followers || 0) + (response.data.isFollowed ? 1 : -1)
						} as PostAuthor)
				)
			}
		} catch (error) {
			console.error(error)
		}
		setFlags({})
	}

	return (
		<LayoutWrapper>
			<div className="max-w-screen-sm mx-auto">
				{flags?.contentLoading ? (
					<BlogSkeleton />
				) : post ? (
					<>
						<h1 className="post__title mb-0">{post?.title}</h1>
						<div className="mt-8 mb-5">
							<div className="flex gap-4 items-center">
								<Image
									className={"rounded-full object-cover w-12 aspect-square flex-shrink-0"}
									src={author?.profile_picture as string}
									alt="user"
									width={32}
									height={32}
								/>
								<div className="flex justify-between w-full">
									<div>
										<div className="flex items-center gap-2">
											<Link href={`/user/${author?.username}`}>
												<span className="text-fontSecondary text-base hover:underline">{`${author?.name}`}</span>
											</Link>
											{(author?.followers || 0) > 0 && (
												<>
													<span className="opacity-60 text-sm">·</span>
													<span className="opacity-60 text-sm">{author?.followers} Followers</span>
												</>
											)}
										</div>
										<span className="ss:hidden block">
											<span className="opacity-60 text-sm">From</span>{" "}
											<Link href={"#"} className="text-sm hover:underline">
												{author?.user_collection?.name}
											</Link>
										</span>
										<div className="flex items-center gap-2">
											{!author?.user_collection?.name && (
												<div className="ss:flex gap-2 hidden">
													<span>
														<span className="opacity-60 text-sm">From</span>{" "}
														<Link href={"#"} className="text-base hover:underline">
															{author?.user_collection?.name}
														</Link>
													</span>
													<span className="opacity-60 text-sm">·</span>
												</div>
											)}
											<span className="opacity-60 text-sm">{post?.reading_time} min read</span>
											<span className="opacity-60 text-sm">·</span>
											<span className="opacity-60 text-sm">{calculateAge(post?.created_at)}</span>
										</div>
									</div>
								</div>
								<div className="ss:flex hidden items-center gap-6">
									{author?.isUserLoggedIn ? (
										<>
											<EditButton url={`/editor?id=${post?._id}`} />
											<DeleteButton postId={post?._id as string} onDelete={() => router.back()} />
										</>
									) : (
										<>
											{session?.user && (
												<Button
													loading={flags?.followLoading}
													className="primary medium !bg-darkHighlight hover:!bg-whitePrimary text-opacity-100 hover:text-black"
													onClick={handleFollow}
												>
													Follow{author?.isFollowed ? "ing" : ""}
												</Button>
											)}
											<ShareButton url={location.origin + getRedirectURL(post?._id, post?.title)} />
											{session?.user && (
												<SaveButton
													postId={post?._id as string}
													isAdded={Boolean(post?.inReadingList)}
													onUpdate={status =>
														setPost(prev => ({
															...(prev as IPost),
															inReadingList: status
														}))
													}
												/>
											)}
										</>
									)}
								</div>
							</div>

							<div className="ss:hidden mt-3 pt-3 border-t border-darkHighlight flex items-center gap-6 w-full">
								{author?.isUserLoggedIn ? (
									<>
										<EditButton url={`/editor?id=${post?._id}`} />
										<DeleteButton postId={post?._id as string} onDelete={() => router.back()} />
									</>
								) : (
									<div className="flex items-center justify-between w-full">
										{session?.user && (
											<Button
												loading={flags?.followLoading}
												className="primary medium !bg-darkHighlight hover:!bg-whitePrimary text-opacity-100 hover:text-black"
												onClick={handleFollow}
											>
												Follow{author?.isFollowed ? "ing" : ""}
											</Button>
										)}
										<div className="flex items-center gap-6">
											<ShareButton url={location.origin + getRedirectURL(post?._id, post?.title)} />
											{session?.user && (
												<SaveButton
													postId={post?._id as string}
													isAdded={Boolean(post?.inReadingList)}
													onUpdate={status =>
														setPost(prev => ({
															...(prev as IPost),
															inReadingList: status
														}))
													}
												/>
											)}
										</div>
									</div>
								)}
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

						{session?.user && author?.username && !author?.isUserLoggedIn && (
							<div>
								<Button
									loading={flags?.likeLoading}
									className="theme-button primary mb-10"
									onClick={handleLike}
									Icon={post?.isLiked ? AiFillLike : AiOutlineLike}
									iconsClassName="text-xl"
								>
									{post?.isLiked ? "Liked" : "Like"}
								</Button>
							</div>
						)}
					</>
				) : null}
			</div>
		</LayoutWrapper>
	)
}

export default Post
