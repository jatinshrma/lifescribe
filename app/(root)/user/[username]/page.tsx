"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { IUser, ICollection, IPost, IProfilePictureComponent, IReadingList } from "@types"
import axios from "axios"
import { PostCard } from "@components"
import { ImageCropWrapper } from "@components/ImageCrop"
import { TbArrowsSort, TbWorld } from "react-icons/tb"
import { FiLock } from "react-icons/fi"
import { AnyObject } from "mongoose"
import { RiQuillPenLine, RiSearchLine, RiUserSettingsLine } from "react-icons/ri"
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

const tabs = [
	{ Icon: TbWorld, label: "Published" },
	{ Icon: FiLock, label: "Private" },
	{ Icon: () => <PiBookmarks className="text-xl" />, label: "Reading List" }
]

const sortOptions = [
	{ Icon: MdFormatColorText, label: "Alphabetically", value: "alphabetically" },
	{ Icon: BsCalendarDate, label: "Date", value: "date" },
	{ Icon: IoMdTime, label: "Last Update", value: "last_update" },
	{ Icon: AiOutlineNumber, label: "Post Count", value: "post_count" }
]

const viewOptions = [
	{ Icon: () => <PiNewspaperClipping className="text-xl" />, type: "Posts" },
	{ Icon: BsCollection, type: "Collections" }
]

const User = () => {
	const { username } = useParams()
	const { data: session } = useSession()
	const [posts, setPosts] = useState<IPost[]>([])
	const [user, setUser] = useState<IUser>()
	const [state, setState] = useState<AnyObject>({ view: viewOptions[1].type, currTab: 0 })
	const [collections, setCollections] = useState<ICollection[]>([])
	const [readingList, setReadingList] = useState<IReadingList>()

	const isAutherLoggedIn = session?.user.username && username === session?.user.username

	useEffect(() => {
		if (username) {
			;(async () => {
				const [userResponse, collectionsResponse, postsResponse, readingListResponse] = await Promise.all([
					axios.get("/api/user", {
						params: { username }
					}),
					axios.get("/api/collection", {
						params: { username, attachPosts: true }
					}),
					axios.get("/api/post", {
						params: { username }
					}),
					axios.get("/api/reading_list")
				])

				setUser(userResponse.data)
				setCollections(collectionsResponse.data)
				setReadingList(readingListResponse.data)
				setPosts(
					postsResponse.data?.map((p: IPost) => ({
						...p,
						private: p.user_collection
							? collectionsResponse.data?.find((c: ICollection) => c._id === p.user_collection)?.private
							: p.private
					}))
				)
			})()
		}
	}, [username])

	return (
		<LayoutWrapper
			navActions={
				<Link href={"/editor"}>
					<button className="theme-button primary">
						<RiQuillPenLine className="h-5 w-5" />
						<span>Scribe</span>
					</button>
				</Link>
			}
		>
			<div className="max-w-[850px] mx-auto mb-8">
				<div className="flex items-center gap-20 pt-16 pb-[72px]">
					<ImageCropWrapper>
						{(props: IProfilePictureComponent) => (
							<Image
								className="object-cover rounded-full aspect-square w-72 h-72 cursor-pointer"
								src={props.url}
								alt="user"
								width={300}
								height={300}
							/>
						)}
					</ImageCropWrapper>

					<div className="space-y-6">
						<h2 className="font-playFD text-5xl font-medium">{user?.name}</h2>
						<p className="font-lora text-whiteSecondary">{user?.about}</p>
						<div className="opacity-60">
							{!user?.private && <span>{posts?.filter(p => !p.private)?.length} Published</span>}
							{isAutherLoggedIn && (
								<>
									<span className="ml-5 px-5 border-l border-[#7777777d]">
										{posts?.filter(p => p.private)?.length} Private
									</span>
									<span className="pl-5 border-l border-[#7777777d]">{readingList?.posts?.length} Saved</span>
								</>
							)}
						</div>
						<div>
							<Link href={"/settings"} className="theme-button primary gap-2.5 medium rounded-lg w-fit">
								<RiUserSettingsLine className="text-lg" />
								<span>Edit Profile</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="sticky top-0 bg-darkPrimary z-10">
					{isAutherLoggedIn && (
						<div className="flex border-b border-darkSecondary text-opacity-100 relative">
							<div
								className={`absolute w-1/3 h-0.5 bg-whitePrimary bottom-0 left-0 transition-all duration-200 ease`}
								style={{ translate: `${(state?.currTab || 0) * 100}%` }}
							/>
							{tabs.slice(user?.private ? 1 : 0, 3).map((i, idx, tabsArr) => (
								<button
									onClick={() => setState(prev => ({ ...prev, currTab: idx, currCollection: null }))}
									className={
										"text-base py-5 flex gap-2 justify-center items-center w-1/3 " +
										(state?.currTab === idx ? "" : " opacity-50")
									}
								>
									<i.Icon className="text-lg" />
									<span>{i.label}</span>
								</button>
							))}
						</div>
					)}
					<div className="flex py-3 gap-4 my-2 justify-between">
						<div>
							{state?.currCollection ? (
								<button
									className="theme-button primary gap-2 pl-3.5"
									onClick={() => setState(prev => ({ ...prev, currCollection: null }))}
								>
									<FiArrowLeft className="text-lg" />
									<span>Back</span>
								</button>
							) : (
								<RadioGroup
									aria-label="View"
									className="bg-darkSecondary flex rounded-full"
									value={state?.view}
									onChange={value => setState(prev => ({ ...prev, view: value }))}
								>
									{viewOptions.map(option => (
										<Radio
											key={option?.type}
											value={option?.type}
											as={"button"}
											className="theme-button flex items-center gap-2 data-[checked]:bg-darkHighlight"
										>
											<option.Icon />
											<span>{option?.type}</span>
										</Radio>
									))}
								</RadioGroup>
							)}
						</div>
						<div className="flex items-stretch gap-4 w-full justify-end">
							<div className="bg-darkSecondary w-full pl-4 py-2 pr-2 rounded-full flex items-center gap-4">
								<input type="text" placeholder="Search" className="w-full" />
								<button className="h-full aspect-square flex items-center justify-center rounded-full text-opacity-100 group hover:bg-whitePrimary transition-colors duration-300 ease">
									<RiSearchLine className="text-lg group-hover:fill-darkPrimary" />
								</button>
							</div>

							<Popover className="relative group">
								<PopoverButton className={"theme-button primary gap-4 px-4 py-3"}>
									<div className="flex gap-2 items-center">
										<TbArrowsSort className="text-lg" />
										<span>Sort</span>
									</div>
									<FaCaretDown className={"text-sm group-data-[open]:rotate-180"} />
								</PopoverButton>
								<PopoverPanel
									anchor="bottom"
									as="div"
									className="py-2 bg-darkSecondary rounded-xl z-20 ring-1 ring-darkHighlight [--anchor-gap:8px]"
								>
									{sortOptions.map(i => (
										<div className="flex justify-between gap-10 px-4 py-2 bg-darkSecondary border-b border-darkHighlight">
											<div className="flex items-center gap-2 w-full">
												<i.Icon className="text-lg" />
												<span>{i.label}</span>
											</div>
											<div className="flex gap-2.5">
												<button
													onClick={() =>
														setState(prev => ({
															...prev,
															sort: {
																[i.value]: 1
															}
														}))
													}
													className={
														"p-2 text-opacity-100 rounded-lg " +
														(state?.sort?.[i.value] === 1 ? "bg-whitePrimary" : "hover:bg-darkHighlight")
													}
												>
													<BsSortUp
														className={"text-xl " + (state?.sort?.[i.value] === 1 ? "fill-darkSecondary" : "")}
													/>
												</button>
												<button
													onClick={() =>
														setState(prev => ({
															...prev,
															sort: {
																[i.value]: -1
															}
														}))
													}
													className={
														"p-2 text-opacity-100 rounded-lg " +
														(state?.sort?.[i.value] === -1 ? "bg-whitePrimary" : "hover:bg-darkHighlight")
													}
												>
													<BsSortDownAlt
														className={"text-xl " + (state?.sort?.[i.value] === -1 ? "fill-darkSecondary" : "")}
													/>
												</button>
											</div>
										</div>
									))}
								</PopoverPanel>
							</Popover>

							<Popover className="relative group">
								<PopoverButton className={"theme-button primary gap-4 px-4 py-3"}>
									<div className="flex gap-2 items-center">
										<BsCalendarDate className="text-lg" />
										<span>Date</span>
									</div>
									<FaCaretDown className={"text-sm group-data-[open]:rotate-180"} />
								</PopoverButton>
								<PopoverPanel
									anchor="bottom end"
									as="div"
									className="px-5 py-4 bg-darkSecondary rounded-xl z-20 ring-1 ring-darkHighlight [--anchor-gap:8px]"
								>
									<span className="text-sm opacity-60 mb-1 block">From Date</span>
									<input type="date" className="theme-input bg-darkHighlight dark:[color-scheme:dark] mb-3" />
									<span className="text-sm opacity-60 mb-1 block">Till Date</span>
									<input type="date" className="theme-input bg-darkHighlight dark:[color-scheme:dark]" />

									<div className="flex justify-between mt-8 gap-16">
										<button className="theme-button bg-darkHighlight">Today</button>

										<div className="flex gap-3">
											<button className="theme-button bg-darkHighlight">Cancel</button>
											<button className="theme-button bg-darkHighlight">Search</button>
										</div>
									</div>
								</PopoverPanel>
							</Popover>
						</div>
					</div>
				</div>

				{isAutherLoggedIn && state.currTab === 2 ? (
					<div className="space-y-5">
						{readingList?.posts?.map(post => (
							<PostCard
								key={"reading_list:" + post?._id}
								{...post}
								inReadingList={true}
								onReadingListUpdate={(status: boolean) =>
									setReadingList((prev: any) => ({
										...prev,
										posts: prev.posts.filter((p: { _id: string }) => p._id !== post?._id || status)
									}))
								}
							/>
						))}
					</div>
				) : state?.view === viewOptions[1].type && !state?.currCollection ? (
					<div className="space-y-5">
						{collections
							?.filter(coll => coll.private === Boolean(state?.currTab))
							?.map(coll => (
								<div
									className="bg-darkSecondary rounded-5xl p-8 cursor-pointer relative first:mt-0"
									onClick={() => setState(prev => ({ ...prev, currCollection: coll._id }))}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<BsCollection className="text-2xl" />
											{coll.created_at && (
												<span className="text-sm opacity-60">
													{new Date(coll.created_at as any)?.toDateString()}
												</span>
											)}
										</div>
									</div>
									<p className="my-5 text-3xl">{coll.name}</p>
									<div className="text-sm opacity-60 flex gap-3">
										<span>
											{coll?.total_posts} Post{(coll?.total_posts as number) > 0 ? "s" : ""}
										</span>
										<span>·</span>
										{coll?.recent_post && (
											<span>Recent post at {new Date(coll.recent_post as any).toDateString()}</span>
										)}
									</div>
									{isAutherLoggedIn && (
										<button className="p-3 rounded-full bg-whitePrimary text-opacity-100 absolute right-8 bottom-5 transition-transform duration-200 ease-linear hover:scale-125">
											<IoAdd className="text-xl stroke-darkSecondary" />
										</button>
									)}
								</div>
							))}
					</div>
				) : (
					<div>
						{state?.currCollection && (
							<h1 className="mt-8 mb-14 text-4xl font-semibold">
								{collections?.find(coll => coll._id === state?.currCollection)?.name}
							</h1>
						)}
						<div className="space-y-5">
							{posts
								?.filter(post =>
									state?.currCollection
										? post.user_collection === state?.currCollection
										: (+post.private || 0) === state?.currTab
								)
								?.map(post => (
									<PostCard key={post?._id} {...post} profileView={true} userView={isAutherLoggedIn} />
								))}
						</div>
					</div>
				)}
			</div>
		</LayoutWrapper>
	)
}

export default User
