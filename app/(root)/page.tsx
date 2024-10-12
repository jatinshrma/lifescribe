"use client"

import { PostCard } from "@components/index"
import { IPostCardProps, ReadingListType } from "@types"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { GoBookmarkSlash } from "react-icons/go"
import LayoutWrapper from "@components/LayoutWrapper"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { calculateAge, getRedirectURL } from "@helpers/utils"
import { PostSkeleton, ReadingListSkeleton, TopArtistSkeleton } from "@components/Skeleton"
import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"
import { BsBookmarkCheck } from "react-icons/bs"

export default function Home() {
	const { data: session } = useSession()
	return (
		<LayoutWrapper showScribeButton>
			<div className="flex gap-16 ss:mx-16">
				<div className={"ss:w-3/4 w-full " + (session?.user?.username ? "" : "m-auto")}>
					<Feed session={session} />
				</div>
				{session?.user?.username && (
					<div className="ss:block hidden w-1/4 h-[82vh] my-2 space-y-6">
						<ReadingList session={session} />
						{/* <TopUsers session={session} /> */}
					</div>
				)}
			</div>
		</LayoutWrapper>
	)
}

const Feed = ({ session }: { session?: Session | null }) => {
	const [posts, setPosts] = useState<IPostCardProps[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (session !== undefined)
			(async () => {
				try {
					const response = await axios.get("/api/post/feed", {
						params: {
							username: session?.user?.username
						}
					})
					if (response.data) {
						setPosts(response?.data)
					}
				} catch (error) {}
				setLoading(false)
			})()
	}, [session])

	return (
		<div className="flex flex-col gap-3">
			<div>
				{loading ? (
					<>
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
					</>
				) : (
					posts?.map(post => (
						<PostCard
							key={post._id.toString()}
							{...post}
							hideTags={true}
							onReadingListUpdate={(status: boolean) =>
								setPosts(prev => prev.map(p => (p._id === post._id ? { ...p, inReadingList: status } : p)))
							}
						/>
					))
				)}
			</div>
		</div>
	)
}

const ReadingList = ({ session }: { session?: Session | null }) => {
	const [readingList, setReadingList] = useState<ReadingListType["posts"]>()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (session?.user?.username)
			(async () => {
				try {
					const response = await axios.get("/api/reading_list", {
						params: {
							recent: true
						}
					})

					if (response.data) {
						setReadingList(
							response.data?.posts?.map((i: { timestamp: Date }) => ({
								...i,
								timeString: calculateAge(i.timestamp, true)
							}))
						)
					}
				} catch (error) {}
				setLoading(false)
			})()
	}, [session])

	const handleReadingList = async (post_id: string) => {
		try {
			const response = await axios.post("/api/reading_list", {
				post_id
			})
			if (response.data.success) {
				setReadingList(prev => (prev?.filter(p => p.post_id !== post_id) || []) as ReadingListType["posts"])
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<div className="mb-4 flex justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<span className="text-sm font-medium opacity-50">Reading list</span>
					{!loading &&
						((readingList?.length || 0) > 0 ? (
							<Link
								href={"/user/" + session?.user.username}
								className="opacity-50 flex gap-2 text-sm items-center"
							>
								<span>See all</span>
								<FiArrowRight className="text-sm" />
							</Link>
						) : null)}
				</div>
			</div>
			{loading ? (
				<>
					<ReadingListSkeleton />
					<ReadingListSkeleton />
				</>
			) : (readingList?.length || 0) > 0 ? (
				<div>
					{readingList?.map(i => (
						<Link href={getRedirectURL(i?.post_id, i?.title)}>
							<div className="border-b border-darkSecondary py-3 last:border-none">
								<div className="flex justify-between w-full">
									<div className="flex gap-3 items-center">
										{i?.user?.profile_picture && (
											<Image
												className={"rounded-full object-cover w-6 aspect-square"}
												src={i.user.profile_picture}
												alt="user"
												width={20}
												height={20}
											/>
										)}
										<div className="text-fontSecondary text-sm opacity-60">
											<span>{i?.user?.name}</span>
											<span className="px-2">·</span>
											<span>{i.timeString}</span>
										</div>
									</div>
									<button
										className="hover:scale-110 transition-all ease-linear"
										onClick={e => {
											e.preventDefault()
											handleReadingList(i.post_id)
										}}
									>
										<GoBookmarkSlash className="text-lg hover:fill-yellow-500" />
									</button>
								</div>
								<p className="mt-2.5 text-sm line-clamp-2">{i?.title}</p>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="flex items-center gap-2 opacity-50">
					<BsBookmarkCheck className="text-base" />
					<span className="text-xs">Your recently saved posts will appear here.</span>
				</div>
			)}
		</>
	)
}

const TopUsers = ({ session }: { session?: Session | null }) => {
	return (
		<div className="pb-6 space-y-6">
			<span className="text-sm font-medium opacity-50">Top artists</span>
			<div>
				<TopArtistSkeleton />
				<TopArtistSkeleton />
			</div>
			{/* <div className="border-b border-darkHighlight last:border-none">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Image
							className={"rounded-full object-cover w-6"}
							src={
								"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
							}
							alt="user"
							width={32}
							height={32}
						/>
						<span className="text-fontSecondary text-base font-medium">Jatin Sharma</span>
					</div>
					<button className="theme-button outlined small font-medium hover:bg-whitePrimary hover:text-black hover:border-whitePrimary">
						Follow
					</button>
				</div>
				<p className="text-sm my-5 line-clamp-2">
					Helping you strenthen your will power and understand brain functioning. Helping you strenthen your will
					power and understand brain functioning.
				</p>
				<div className="flex gap-1 items-center flex-nowrap max-w-[20vw] overflow-auto">
					<button className="theme-button small outlined text-opacity-20">Education</button>
					<button className="theme-button small outlined text-opacity-20">Education</button>
					<button className="theme-button small outlined text-opacity-20">Fitness</button>
					<button className="theme-button small outlined text-opacity-20">Entrepreneurship</button>
				</div>
			</div> */}
		</div>
	)
}
