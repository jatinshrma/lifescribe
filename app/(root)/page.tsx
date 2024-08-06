"use client"

import { PostCard } from "@components/index"
import { IPostCardProps, IReadingList } from "@types"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { GoBookmarkSlash } from "react-icons/go"
import { FiArrowRight, FiFilter, FiSearch } from "react-icons/fi"
import { MdOutlineGroupAdd } from "react-icons/md"
import LayoutWrapper from "@components/LayoutWrapper"
import { RiQuillPenLine } from "react-icons/ri"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { PiBookmarks } from "react-icons/pi"
import { Session } from "next-auth"
import { FaChevronRight } from "react-icons/fa6"
import { calculateAge } from "@helpers/utils"

export default function Home() {
	const { data: session } = useSession()
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
			<div className="flex gap-16 mx-16">
				<Feed session={session} />
				<div className="w-1/4 h-[82vh] my-2">
					<ReadingList session={session} />
					<TopUsers session={session} />
				</div>
			</div>
		</LayoutWrapper>
	)
}

const Feed = ({ session }: { session?: Session | null }) => {
	const [posts, setPosts] = useState<IPostCardProps[]>([])

	useEffect(() => {
		if (session !== undefined)
			(async () => {
				const response = await axios.get("/api/post/feed", {
					params: {
						username: session?.user?.username
					}
				})
				if (response.data) {
					setPosts(response?.data)
				}
			})()
	}, [session])

	return (
		<div className="w-3/4 flex flex-col gap-3">
			<div className="flex items-center gap-3 rounded-full p-4 px-5 bg-darkSecondary w-full">
				<span>
					<FiSearch className="ss:text-[1.1rem] text-[1rem]" />
				</span>
				<input
					type="text"
					placeholder="Search posts, topics or users"
					className="text-sm w-full text-whitePrimary text-opacity-100 placeholder:text-whitePrimary placeholder:text-opacity-60"
				/>
				<button className="flex gap-2 items-center px-4">
					<FiFilter />
					Filter
				</button>
			</div>
			<div>
				{posts?.map(post => (
					<PostCard
						key={post._id.toString()}
						{...post}
						hideTags={true}
						onReadingListUpdate={(status: boolean) =>
							setPosts(prev => prev.map(p => (p._id === post._id ? { ...p, inReadingList: status } : p)))
						}
					/>
				))}
			</div>
		</div>
	)
}

const ReadingList = ({ session }: { session?: Session | null }) => {
	const [readingList, setReadingList] = useState<IReadingList["posts"]>()

	useEffect(() => {
		if (session?.user?.username)
			(async () => {
				const response = await axios.get("/api/reading_list", {
					params: {
						recent: true
					}
				})

				if (response.data) {
					setReadingList(
						response.data?.posts?.map(i => ({
							...i,
							timeString: calculateAge(i.timestamp, true)
						}))
					)
				}
			})()
	}, [session])

	const handleReadingList = async (post_id: string) => {
		try {
			const response = await axios.post("/api/reading_list", {
				post_id
			})
			if (response.data.success) {
				setReadingList(prev => prev?.filter(p => p.post_id !== post_id) || [])
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<div className="flex justify-between items-center w-full">
					<div className="flex items-center gap-2">
						<PiBookmarks className="text-2xl" />
						<span className="text-lg font-medium">Reading List</span>
					</div>
					<button className="flex p-2 aspect-square rounded-full hover:bg-darkHighlight">
						<FaChevronRight className="text-sm" />
					</button>
				</div>
			</div>
			<div>
				{readingList?.map(i => (
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
								onClick={() => handleReadingList(i.post_id)}
							>
								<GoBookmarkSlash className="text-lg hover:fill-yellow-500" />
							</button>
						</div>
						<p className="mt-2.5 text-sm line-clamp-2">{i?.title}</p>
					</div>
				))}
			</div>
		</>
	)
}

const TopUsers = ({ session }: { session?: Session | null }) => {
	return (
		<div className="mt-10 pb-6 space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg flex items-center gap-2 font-medium">
					<MdOutlineGroupAdd />
					Top users
				</h2>
			</div>

			<div className="border-b border-darkHighlight last:border-none">
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
			</div>
		</div>
	)
}
