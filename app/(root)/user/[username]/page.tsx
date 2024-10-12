"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import {
	IUser,
	ICollection,
	IPost,
	IProfilePictureComponent,
	IReadingList,
	ReadingListType,
	ReadingListItem
} from "@types"
import axios, { AxiosRequestConfig } from "axios"
import { PostCard } from "@components"
import { ImageCropWrapper } from "@components/ImageCrop"
import { TbArrowsSort, TbWorld } from "react-icons/tb"
import { FiLock } from "react-icons/fi"
import { AnyObject } from "mongoose"
import { RiSearchLine, RiUserSettingsLine } from "react-icons/ri"
import { BsCollection } from "react-icons/bs"
import { FiArrowLeft } from "react-icons/fi"
import { BsCalendarDate } from "react-icons/bs"
import { BsSortUp } from "react-icons/bs"
import { BsSortDownAlt } from "react-icons/bs"
import { IoMdTime } from "react-icons/io"
import { AiOutlineNumber } from "react-icons/ai"
import { IoAdd } from "react-icons/io5"
import { MdFormatColorText } from "react-icons/md"
import LayoutWrapper from "@components/LayoutWrapper"
import Link from "next/link"
import { PiBookmarks, PiNewspaperClipping } from "react-icons/pi"
import { Radio, RadioGroup } from "@headlessui/react"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { FaCaretDown } from "react-icons/fa6"
import { useParams } from "next/navigation"
import { PostSkeleton, ProfileSkeleton } from "@components/Skeleton"

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

const sortOptions = [
	{ Icon: MdFormatColorText, label: "Alphabetically", value: "alphabetically" },
	{ Icon: BsCalendarDate, label: "Date", value: "date" },
	{ Icon: IoMdTime, label: "Last Update", value: "last_update" },
	{ Icon: AiOutlineNumber, label: "Post Count", value: "post_count" }
]

const viewOptions = [
	{ Icon: (props: any) => <PiNewspaperClipping className={"text-xl " + props?.className} />, type: "Posts" },
	{ Icon: BsCollection, type: "Collections" }
]

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
								[tabs[currTab].value]: prev.private.filter(i => i._id !== postId)
							}))
						}
					/>
				)}
			</div>
		</LayoutWrapper>
	)
}

type ValuesStateType = {
	currCollection?: {
		_id: string
		name: string
	}
	view?: string
}

const Header = ({
	loading,
	state,
	changeState
}: {
	loading?: boolean
	state: ValuesStateType
	changeState: (values: { [x: string]: any }) => void
}) => {
	return (
		<div className="flex ss:flex-row flex-col ss:py-3 mt-3 pb-3 ss:gap-4 gap-3 ss:my-2 justify-between">
			<div className="ss:w-fit w-full">
				{state?.currCollection ? (
					<button
						disabled={loading}
						className="theme-button primary gap-2 ss:pl-3.5 pl-3"
						onClick={() => changeState({ currCollection: null })}
					>
						<FiArrowLeft className="ss:text-lg text-base" />
						<span className="ss:text-base text-sm">Back</span>
					</button>
				) : (
					<RadioGroup
						disabled={loading}
						aria-label="View"
						className="bg-darkSecondary rounded-full flex ss:w-fit w-full"
						value={state?.view}
						onChange={value => changeState({ view: value })}
					>
						{viewOptions.map(option => (
							<Radio
								disabled={loading}
								key={option?.type}
								value={option?.type}
								as={"button"}
								className="theme-button flex items-center gap-2 data-[checked]:bg-darkHighlight ss:w-fit w-full justify-center"
							>
								<option.Icon className="ss:text-base text-sm" />
								<span className="ss:text-base text-sm">{option?.type}</span>
							</Radio>
						))}
					</RadioGroup>
				)}
			</div>

			<div className="flex items-stretch gap-4 w-full justify-end">
				<div className="ss:bg-darkSecondary ss:border-none border border-darkHighlight w-full pl-4 py-2 pr-2 rounded-full flex items-center gap-4">
					<input disabled={loading} type="text" placeholder="Search" className="w-full" />
					<button
						disabled={loading}
						className="h-full aspect-square flex items-center justify-center rounded-full text-opacity-100 group hover:bg-whitePrimary transition-colors duration-300 ease"
					>
						<RiSearchLine className="text-lg group-hover:fill-darkPrimary" />
					</button>
				</div>
			</div>
		</div>
	)
}

const Posts = ({
	posts,
	isAutherLoggedIn,
	onDelete
}: {
	posts: IPost[]
	isAutherLoggedIn: boolean
	onDelete: (postId: string) => void
}) => {
	return (
		<div className="ss:space-y-5">
			{posts?.map(post => (
				<PostCard
					key={post?._id}
					{...post}
					profileView={true}
					userView={isAutherLoggedIn}
					onDelete={() => onDelete(post._id || "")}
				/>
			))}
		</div>
	)
}

const Collections = ({
	collections,
	isAutherLoggedIn,
	onCollectionSelect
}: {
	collections: ICollection[]
	isAutherLoggedIn: boolean
	onCollectionSelect: (value: { _id: string; name: string }) => void
}) => {
	return (
		<div className="space-y-5">
			{collections?.length > 0 &&
				collections?.map(coll => (
					<div
						className="bg-darkSecondary ss:rounded-5xl rounded-3xl ss:p-8 p-6 cursor-pointer relative first:mt-0"
						onClick={() => onCollectionSelect({ _id: coll?._id as string, name: coll?.name })}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center ss:gap-4 gap-3">
								<BsCollection className="ss:text-2xl text-lg" />
								{coll?.created_at && (
									<span className="ss:text-sm text-xs opacity-60">
										{new Date(coll?.created_at as any)?.toDateString()}
									</span>
								)}
							</div>
						</div>
						<p className="ss:my-5 my-4 ss:text-3xl text-2xl">{coll?.name}</p>
						<div className="ss:text-sm text-xs opacity-60 flex ss:gap-3 gap-2">
							<span>
								{coll?.total_posts} post{(coll?.total_posts as number) > 0 ? "s" : ""}
							</span>
							{coll?.recent_post && (
								<>
									<span>·</span>
									<span>Recent post at {new Date(coll?.recent_post as any).toDateString()}</span>
								</>
							)}
						</div>
						{isAutherLoggedIn && (
							<button className="ss:p-3 p-2 rounded-full bg-whitePrimary text-opacity-100 absolute ss:right-8 right-6 bottom-5 transition-transform duration-200 ease-linear hover:scale-125">
								<IoAdd className="text-xl stroke-darkSecondary" />
							</button>
						)}
					</div>
				))}
		</div>
	)
}

const Content = ({
	isAutherLoggedIn,
	posts,
	collections,
	loadPosts,
	loadCollections,
	deletePost
}: {
	isAutherLoggedIn: boolean
	posts: IPost[]
	collections: ICollection[]
	loadPosts: () => Promise<void>
	loadCollections: () => Promise<void>
	deletePost: (postId: string) => void
}) => {
	const [loading, setLoading] = useState(true)
	const [state, setState] = useState<ValuesStateType>({
		view: viewOptions[0].type
	})

	useEffect(() => {
		;(async () => {
			setLoading(true)
			try {
				if (!posts?.length && !collections?.length) {
					await loadPosts()
					await loadCollections()
				}
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
						<h1 className="mt-8 mb-14 text-4xl font-semibold">{state?.currCollection?.name}</h1>
					)}
					<Posts posts={posts} isAutherLoggedIn={isAutherLoggedIn} onDelete={deletePost} />
				</>
			) : (
				<Collections
					collections={collections}
					isAutherLoggedIn={isAutherLoggedIn}
					onCollectionSelect={value => setState(prev => ({ ...prev, currCollection: value }))}
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
