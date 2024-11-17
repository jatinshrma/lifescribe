"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { IUser, ICollection, IPost, ReadingListItem } from "@types"
import axios, { AxiosRequestConfig } from "axios"
import { PostCard } from "@components"
import { TbWorld } from "react-icons/tb"
import { FiLock } from "react-icons/fi"
import { RiUserSettingsLine } from "react-icons/ri"
import { BsCalendarDate } from "react-icons/bs"
import { IoMdTime } from "react-icons/io"
import { AiOutlineNumber } from "react-icons/ai"
import { MdFormatColorText } from "react-icons/md"
import LayoutWrapper from "@components/LayoutWrapper"
import Link from "next/link"
import { PiBookmarks } from "react-icons/pi"
import { useParams } from "next/navigation"
import { PostSkeleton, ProfileSkeleton } from "@components/Skeleton"
import { ValuesStateType } from "./types"
import { viewOptions } from "./constants"
import Header from "./components/Header"
import Collections from "./components/Collections"
import Posts from "./components/Posts"

type PageConfigType = {
	currentPage: number
	totalPages: number
}

const PAGE_SIZE = 20

const tabs = [
	{ Icon: TbWorld, label: "Published", value: "public" },
	{ Icon: FiLock, label: "Private", value: "private" },
	{ Icon: () => <PiBookmarks className="text-xl" />, label: "Reading List", value: "readingList" }
]

// const sortOptions = [
// 	{ Icon: MdFormatColorText, label: "Alphabetically", value: "alphabetically" },
// 	{ Icon: BsCalendarDate, label: "Date", value: "date" },
// 	{ Icon: IoMdTime, label: "Last Update", value: "last_update" },
// 	{ Icon: AiOutlineNumber, label: "Post Count", value: "post_count" }
// ]

const User = () => {
	const { username } = useParams()
	const { data: session } = useSession()

	const [posts, setPosts] = useState<{
		private: IPost[]
		public: IPost[]
	}>({ private: [], public: [] })

	const [collections, setCollections] = useState<{
		private: ICollection[]
		public: ICollection[]
	}>({ private: [], public: [] })

	const [paginationConfig, setPaginationConfig] = useState<{
		private?: PageConfigType
		public?: PageConfigType
		readingList?: PageConfigType
	}>({})

	const [user, setUser] = useState<IUser>()
	const [currTab, setCurrTab] = useState(0)
	const [readingList, setReadingList] = useState<ReadingListItem[]>([])
	const [loading, setLoading] = useState(true)

	const isAutherLoggedIn = session?.user.username && username === session?.user.username

	useEffect(() => {
		if (username) {
			;(async () => {
				try {
					const userResponse = await axios.get("/api/user", {
						params: { username }
					})
					setUser(userResponse.data)
				} catch (error) {}
				setLoading(false)
			})()
		}
	}, [username])

	const fetchData = async ({ url, params = {} }: { url: string; params?: AxiosRequestConfig["params"] }) => {
		const pageNumber = paginationConfig[visibilityType]?.currentPage || 0
		const response = await axios.get(url, {
			params: {
				username,
				private: currTab,
				skipPages: pageNumber,
				pageSize: PAGE_SIZE,
				...params
			}
		})

		setPaginationConfig(prev => ({
			...prev,
			[visibilityType]: {
				currentPage: pageNumber,
				totalPages: response.data?.totalPages || prev[visibilityType]?.totalPages
			}
		}))

		return response.data.result || []
	}

	const loadPosts = async () => {
		// ?.filter(coll => coll?.private === Boolean(visibility))
		const data = await fetchData({ url: "/api/post" })
		setPosts(prev => ({
			...prev,
			[visibilityType]: prev[visibilityType].concat(data)
		}))
	}

	const loadCollections = async () => {
		const data = await fetchData({ url: "/api/collection", params: { attachPosts: true } })
		setCollections(prev => ({
			...prev,
			[visibilityType]: prev[visibilityType].concat(data)
		}))
	}

	const loadReadingList = async () => {
		const data = await fetchData({ url: "/api/reading_list" })
		setReadingList(prev => prev.concat([...data]))
	}

	const visibilityType = tabs[currTab].value as "public" | "private"

	return (
		<LayoutWrapper showScribeButton>
			<div className="max-w-[850px] mx-auto mb-8">
				{loading ? (
					<ProfileSkeleton />
				) : (
					<>
						<div className="flex items-center ss:gap-20 gap-6 ss:pt-[5rem] ss:pb-[72px] py-6">
							<Image
								className="object-cover rounded-full aspect-square ss:w-[20rem] ss:h-[20rem] w-24 cursor-pointer"
								src={user?.profile_picture as string}
								alt="user"
								width={364}
								height={364}
							/>

							<div className="ss:space-y-4 space-y-2">
								<h2
									className="font-serif font-extrabold leading-none"
									style={{ fontSize: `calc(56vw / ${Math.min(30, Math.max(12, user?.name?.length || 0))})` }}
								>
									{user?.name}
								</h2>
								<p className="ss:block hidden text-base font-lora text-whiteSecondary">{user?.about}</p>
								{/* <div className="opacity-60 ss:text-base text-sm !mb-3 block">
									{!user?.private && <span>{posts?.filter(p => !p.private)?.length} Published</span>}
									{isAutherLoggedIn && (
										<>
											<span className="ss:ml-5 ml-2 ss:px-5 px-2 border-l border-[#7777777d]">
												{posts?.filter(p => p.private)?.length} Private
											</span>
											<span className="ss:pl-5 pl-2 border-l border-[#7777777d]">
												{readingList?.posts?.length} Saved
											</span>
										</>
									)}
								</div> */}
								<div>
									{isAutherLoggedIn && (
										<Link
											href={"/settings"}
											className="theme-button primary gap-2.5 !px-2.5 medium rounded-lg w-fit"
										>
											<RiUserSettingsLine className="ss:text-lg text-base" />
											<span className="ss:text-base text-sm">Edit Profile</span>
										</Link>
									)}
								</div>
							</div>
						</div>
						{user?.about && <p className="ss:hidden block text-sm font-lora text-whiteSecondary">{user?.about}</p>}
					</>
				)}

				{/* Header */}
				<div className="sticky top-0 bg-darkPrimary z-10">
					{isAutherLoggedIn && (
						<div className="flex border-b border-darkSecondary text-opacity-100 relative">
							<div
								className={`absolute w-1/3 h-0.5 bg-whitePrimary bottom-0 left-0 transition-all duration-200 ease`}
								style={{ translate: `${(currTab || 0) * 100}%` }}
							/>
							{tabs.slice(user?.private ? 1 : 0, 3).map((i, idx, tabsArr) => (
								<button
									key={"profile-tab:" + i.label}
									disabled={loading}
									onClick={() => setCurrTab(idx)}
									className={
										"text-base py-5 flex gap-2 justify-center items-center w-1/3 " +
										(currTab === idx ? "" : " opacity-50")
									}
								>
									<i.Icon className="ss:text-lg text-base" />
									<span className="ss:text-base text-sm">{i.label}</span>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Content */}
				{loading ? null : isAutherLoggedIn && currTab === 2 ? (
					<ReadingList
						readingList={readingList}
						loadReadingList={loadReadingList}
						update={(post_id, status) =>
							setReadingList((prev: any) => ({
								...prev,
								posts: prev.posts.filter((p: { _id: string }) => p._id !== post_id || status)
							}))
						}
					/>
				) : (
					<Content
						isAutherLoggedIn={Boolean(isAutherLoggedIn)}
						posts={posts[visibilityType]}
						collections={collections[visibilityType]}
						loadPosts={loadPosts}
						loadCollections={loadCollections}
						deletePost={postId =>
							setPosts(prev => ({
								...prev,
								[visibilityType]: prev?.[visibilityType]?.filter(i => i._id !== postId)
							}))
						}
						deleteCollection={(collId, deleteOption) => {
							setCollections(prev => ({
								...prev,
								[visibilityType]: prev?.[visibilityType]?.filter(i => i._id !== collId)
							}))

							if (deleteOption === -1)
								setPosts(prev => ({
									...prev,
									[visibilityType]: prev?.[visibilityType]?.filter(i => i.user_collection !== collId)
								}))
							else if (deleteOption === 1 && currTab === 0)
								setPosts(prev => ({
									...prev,
									public: prev.public?.filter(i => i.user_collection !== collId),
									private: prev.private.concat(
										prev.public?.filter(i => i.user_collection === collId)?.map(i => ({ ...i, private: true }))
									)
								}))
							else if (deleteOption === 0 && currTab === 1)
								setPosts(prev => ({
									...prev,
									private: prev.private?.filter(i => i.user_collection !== collId),
									public: prev.public.concat(
										prev.private?.filter(i => i.user_collection === collId)?.map(i => ({ ...i, private: false }))
									)
								}))
						}}
					/>
				)}
			</div>
		</LayoutWrapper>
	)
}

const Content = ({
	isAutherLoggedIn,
	posts,
	collections,
	loadPosts,
	loadCollections,
	deletePost,
	deleteCollection
}: {
	isAutherLoggedIn: boolean
	posts: IPost[]
	collections: ICollection[]
	loadPosts: () => Promise<void>
	loadCollections: () => Promise<void>
	deletePost: (postId: string) => void
	deleteCollection: (collId: string, deleteOption: number) => void
}) => {
	const [loading, setLoading] = useState(true)
	const [state, setState] = useState<ValuesStateType>({
		view: viewOptions[0].type
	})

	useEffect(() => {
		if (!posts?.length && !collections?.length)
			(async () => {
				setLoading(true)
				try {
					await loadPosts()
					await loadCollections()
				} catch (error) {}
				setLoading(false)
			})()
	}, [posts?.length, collections?.length])

	if (loading)
		return (
			<div>
				<PostSkeleton />
				<PostSkeleton />
			</div>
		)
	return (
		<>
			<Header
				loading={loading}
				state={state}
				changeState={(values: ValuesStateType) => setState(prev => ({ ...prev, ...values }))}
			/>
			{state?.currCollection || state?.view === viewOptions[0].type ? (
				<>
					{state?.currCollection?.name && (
						<h1 className="ss:mt-8 ss:mb-14 mt-5 mb-8 ss:text-4xl text-3xl font-semibold">
							{state?.currCollection?.name}
						</h1>
					)}
					<Posts
						posts={
							state?.currCollection?.name
								? posts?.filter(i => i.user_collection === state?.currCollection?._id)
								: posts
						}
						isAutherLoggedIn={isAutherLoggedIn}
						onDelete={deletePost}
					/>
				</>
			) : (
				<Collections
					collections={collections}
					isAutherLoggedIn={isAutherLoggedIn}
					onCollectionSelect={value => setState(prev => ({ ...prev, currCollection: value }))}
					onDelete={deleteCollection}
				/>
			)}
		</>
	)
}

const ReadingList = ({
	readingList,
	update,
	loadReadingList
}: {
	readingList?: ReadingListItem[]
	loadReadingList: () => Promise<void>
	update: (post_id: string, status: boolean) => void
}) => {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			setLoading(true)
			try {
				if (!readingList?.length) await loadReadingList()
			} catch (error) {}
			setLoading(false)
		})()
	}, [readingList?.length])

	if (loading)
		return (
			<div>
				<PostSkeleton />
				<PostSkeleton />
			</div>
		)
	return (
		<div className="ss:space-y-5">
			{readingList?.map(post => (
				<PostCard
					key={"reading_list:" + post?.post_id}
					{...post}
					inReadingList={true}
					onReadingListUpdate={(status: boolean) => update(post?.post_id as string, status)}
				/>
			))}
		</div>
	)
}

export default User
