"use client"

import { BlogCard } from "@components/index"
import { IBlogCardProps } from "@utils/types"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { BiBookmark } from "react-icons/bi"
import { GoBookmark, GoBookmarkSlash } from "react-icons/go"
import { MdOutlineReviews } from "react-icons/md"
import { FiBookmark, FiFilter, FiSearch } from "react-icons/fi"
import { FaRegHeart } from "react-icons/fa"
import { FaRegComment } from "react-icons/fa6"

export default function Home() {
	const [blogs, setBlogs] = useState<IBlogCardProps[]>([])

	useEffect(() => {
		;(async () => {
			const response = await axios.get("/api/blogpost/suggestions")
			if (response.data) {
				setBlogs(response?.data)
			}
		})()
	}, [])

	return (
		<div id="home" className="mx-5">
			<div className="flex w-full gap-8">
				<LeftSidebar />
				<div className="w-2/4 flex flex-col gap-3">
					{blogs?.map(blog => (
						<BlogCard key={blog._id.toString()} {...blog} hideTags={true} hideHoverEffect={true} />
					))}
				</div>
				<RightSidebar />
			</div>
		</div>
	)
}

const LeftSidebar = () => {
	return (
		<div className="w-1/4 h-[82vh] my-4">
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
			<span className="opacity-60 text-sm">Today</span>
			<div className="my-5">
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
					<p className="text-base mt-1.5">What's a blog & why you need one</p>
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
					<p className="text-base mt-1.5">What's a blog & why you need one</p>
				</div>
			</div>
			<span className="opacity-60 text-sm">16 Jan 2024</span>
			<div className="my-5">
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
					<p className="text-base mt-1.5">What's a blog & why you need one</p>
				</div>
			</div>
		</div>
	)
}

const RightSidebar = () => {
	return (
		<div className="w-1/4 h-[82vh] my-4">
			<div className="flex justify-between items-center">
				<h2 className="text-lg flex items-center gap-2 font-medium">
					<MdOutlineReviews />
					Reviews
				</h2>
			</div>

			{/* <div className="border-b border-darkSecondary pt-3 pb-4 mb-4">
				<div className="flex justify-between w-full">
					<div className="flex gap-3 items-center">
						<Image
							className={"rounded-full object-cover w-6"}
							src={
								"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
							}
							alt="user"
							width={32}
							height={32}
						/>
						<span className="text-fontSecondary text-sm font-medium">Jatin Sharma</span>
					</div>
				</div>
			</div> */}

			<div className="flex gap-3 items-start my-5">
				<Image
					className={"rounded-full object-cover w-6"}
					src={
						"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
					}
					alt="user"
					width={32}
					height={32}
				/>
				<div className="-mt-1">
					<div>
						<span className="text-fontSecondary text-sm font-medium">Jatin Sharma</span>
						<p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, dignissimos!</p>
					</div>
					<div className="mt-2 mb-1 flex gap-4">
						<button className="flex gap-2 items-center">
							<FaRegHeart className="text-sm" />
							<span className="text-xs opacity-60">Like · 24M</span>
						</button>
						<button className="flex gap-2 items-center">
							<FaRegComment className="text-sm" />
							<span className="text-xs opacity-60">Reply · 53k</span>
						</button>
					</div>
					<button>
						<span className="text-xs opacity-60">View 50 comments</span>
					</button>
				</div>
			</div>
			<div className="flex gap-3 items-start my-5">
				<Image
					className={"rounded-full object-cover w-6"}
					src={
						"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
					}
					alt="user"
					width={32}
					height={32}
				/>
				<div className="-mt-1">
					<div>
						<span className="text-fontSecondary text-sm font-medium">Jatin Sharma</span>
						<p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, dignissimos!</p>
					</div>
					<div className="mt-2 mb-1 flex gap-4">
						<button className="flex gap-2 items-center">
							<FaRegHeart className="text-sm" />
							<span className="text-xs opacity-60">Like · 24M</span>
						</button>
						<button className="flex gap-2 items-center">
							<FaRegComment className="text-sm" />
							<span className="text-xs opacity-60">Reply · 53k</span>
						</button>
					</div>
				</div>
			</div>
			<div className="flex gap-3 items-start my-5">
				<Image
					className={"rounded-full object-cover w-6"}
					src={
						"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
					}
					alt="user"
					width={32}
					height={32}
				/>
				<div className="-mt-1">
					<div>
						<span className="text-fontSecondary text-sm font-medium">Jatin Sharma</span>
						<p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, dignissimos!</p>
					</div>
					<div className="mt-2 mb-1 flex gap-4">
						<button className="flex gap-2 items-center">
							<FaRegHeart className="text-sm" />
							<span className="text-xs opacity-60">Like · 24M</span>
						</button>
						<button className="flex gap-2 items-center">
							<FaRegComment className="text-sm" />
							<span className="text-xs opacity-60">Reply · 53k</span>
						</button>
					</div>
					<button>
						<span className="text-xs opacity-60">View 5 comments</span>
					</button>
				</div>
			</div>
			<div className="flex gap-3 items-start my-5">
				<Image
					className={"rounded-full object-cover w-6"}
					src={
						"/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIscoeg1atIm2RbbjLewqrfOU22BFNrB0VFD3iIdz_LL4c%3Ds96-c&w=64&q=75"
					}
					alt="user"
					width={32}
					height={32}
				/>
				<div className="-mt-1">
					<div>
						<span className="text-fontSecondary text-sm font-medium">Jatin Sharma</span>
						<p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, dignissimos!</p>
					</div>
					<div className="mt-2 mb-1 flex gap-4">
						<button className="flex gap-2 items-center">
							<FaRegHeart className="text-sm" />
							<span className="text-xs opacity-60">Like · 24M</span>
						</button>
						<button className="flex gap-2 items-center">
							<FaRegComment className="text-sm" />
							<span className="text-xs opacity-60">Reply · 53k</span>
						</button>
					</div>
					<button>
						<span className="text-xs opacity-60">View 50 comments</span>
					</button>
				</div>
			</div>
		</div>
	)
}
