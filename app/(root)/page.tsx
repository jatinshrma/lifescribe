"use client"

import { PostCard } from "@components/index"
import { IPostCardProps } from "@types"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { GoBookmarkSlash } from "react-icons/go"
import { FiBookmark, FiFilter, FiSearch } from "react-icons/fi"
import { MdOutlineGroupAdd } from "react-icons/md"
import LayoutWrapper from "@components/LayoutWrapper"
import { RiQuillPenLine } from "react-icons/ri"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Home() {
	const [posts, setPosts] = useState<IPostCardProps[]>([])
	const { data: session } = useSession()

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/post/suggestions", {
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
				<div className="w-3/4 flex flex-col gap-3">
					<div className="flex items-center gap-3 rounded-full p-4 px-5 bg-darkSecondary w-full">
						<span>
							<FiSearch className="ss:text-[1.1rem] text-[1rem]" />
						</span>
						<input
							type="text"
							placeholder="Search posts, topics or authors"
							className="text-sm w-full text-whitePrimary text-opacity-100 placeholder:text-whitePrimary placeholder:text-opacity-60"
						/>
						<button className="flex gap-2 items-center px-4">
							<FiFilter />
							Filter
						</button>
					</div>
					<div>
						{posts?.map(post => (
							<PostCard key={post._id.toString()} {...post} hideTags={true} hideHoverEffect={true} />
						))}
					</div>
				</div>
				<RightSidebar />
			</div>
		</LayoutWrapper>
	)
}

const ReadingList = () => {
	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg flex items-center gap-2 font-medium">
					<FiBookmark />
					Reading List
				</h2>
				<div className="flex gap-1">
					<button className="flex p-2 aspect-square rounded-full hover:bg-darkHighlight">
						<FiSearch />
					</button>
					<button className="flex p-2 aspect-square rounded-full hover:bg-darkHighlight">
						<FiFilter />
					</button>
				</div>
			</div>
			<div className="mt-6 mb-2 flex items-center gap-3 opacity-50">
				<span className="text-sm whitespace-nowrap">Today</span>
			</div>
			<div>
				<div className="border-b border-darkSecondary py-3 last:border-none">
					<div className="flex justify-between w-full">
						<div className="flex gap-2 items-center">
							<Image
								className={"rounded-full object-cover w-5"}
								src={
									"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
								}
								alt="user"
								width={20}
								height={20}
							/>
							<span className="text-fontSecondary text-sm">Jatin Sharma</span>
							<span className="opacity-60 text-sm">·</span>
							<span className="opacity-60 text-sm">5 days</span>
						</div>
						<button>
							<GoBookmarkSlash className="text-lg hover:fill-yellow-500" />
						</button>
					</div>
					<p className="mt-2.5 line-clamp-2 text-sm">What's a post & why you need one</p>
				</div>
				<div className="border-b border-darkSecondary py-3 last:border-none">
					<div className="flex justify-between w-full">
						<div className="flex gap-2 items-center">
							<Image
								className={"rounded-full object-cover w-5"}
								src={
									"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
								}
								alt="user"
								width={20}
								height={20}
							/>
							<span className="text-fontSecondary text-sm">Jatin Sharma</span>
							<span className="opacity-60 text-sm">·</span>
							<span className="opacity-60 text-sm">5 days</span>
						</div>
						<button>
							<GoBookmarkSlash className="text-lg hover:fill-yellow-500" />
						</button>
					</div>
					<p className="mt-2.5 line-clamp-2 text-sm">What's a post & why you need one</p>
				</div>
			</div>
			<div className="mt-6 mb-2 flex items-center gap-3 opacity-50">
				<span className="text-sm whitespace-nowrap">16 Jan 2024</span>
			</div>
			<div>
				<div className="border-b border-darkSecondary py-3 last:border-none">
					<div className="flex justify-between w-full">
						<div className="flex gap-2 items-center">
							<Image
								className={"rounded-full object-cover w-5"}
								src={
									"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
								}
								alt="user"
								width={20}
								height={20}
							/>
							<span className="text-fontSecondary text-sm">Jatin Sharma</span>
							<span className="opacity-60 text-sm">·</span>
							<span className="opacity-60 text-sm">5 days</span>
						</div>
						<button>
							<GoBookmarkSlash className="text-lg hover:fill-yellow-500" />
						</button>
					</div>
					<p className="mt-2.5 line-clamp-2 text-sm">What's a post & why you need one</p>
				</div>
			</div>
		</>
	)
}

const RightSidebar = () => {
	return (
		<div className="w-1/4 h-[82vh] my-2">
			<ReadingList />
			<div className="mt-10 pb-6 space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-lg flex items-center gap-2 font-medium">
						<MdOutlineGroupAdd />
						Top authors
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
		</div>
	)
}
