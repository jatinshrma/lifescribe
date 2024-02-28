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
import { TiGroupOutline } from "react-icons/ti"
import { MdOutlineGroupAdd } from "react-icons/md"
import { RiUserAddLine } from "react-icons/ri"
import { IoMdAdd } from "react-icons/io"

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
					<div className="flex gap-3 rounded-full p-3 px-3.5 bg-darkSecondary w-full">
						<span>
							<FiSearch className="ss:text-[22px] text-[1rem]" />
						</span>
						<input
							type="text"
							placeholder="Search blogs, topics or authors"
							className="text-sm w-full text-whitePrimary text-opacity-100 placeholder:text-whitePrimary placeholder:text-opacity-60"
						/>
						<button className="flex gap-2 items-center px-4">
							<FiFilter />
							Filter
						</button>
					</div>
					{blogs?.map(blog => (
						<BlogCard key={blog._id.toString()} {...blog} hideTags={true} hideHoverEffect={true} />
					))}
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
		<div className="w-1/4 h-[82vh] my-2">
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
		<div className="w-1/4 h-[82vh] my-2">
			<div className="flex justify-between items-center">
				<h2 className="text-lg flex items-center gap-2 font-medium">
					<MdOutlineGroupAdd />
					Top authors
				</h2>
			</div>

			<div className="py-5 border-b border-darkHighlight last:border-none">
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
					<button className="items-center border border-whiteSecondary text-[14px] rounded-full px-2.5 py-1 text-opacity-80">
						Follow
					</button>
				</div>
				<p className="text-sm my-2">Helping you strenthen your will power and understand brain functioning.</p>
				<div className="flex gap-1 items-center flex-wrap">
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Education
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Fitness
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Entrepreneurship
					</button>
				</div>
			</div>

			<div className="py-5 border-b border-darkHighlight last:border-none">
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
					<button className="items-center border border-whiteSecondary text-[14px] rounded-full px-2.5 py-1 text-opacity-80">
						Follow
					</button>
				</div>
				<p className="text-sm my-2">Helping you strenthen your will power and understand brain functioning.</p>
				<div className="flex gap-1 items-center flex-wrap">
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Education
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Fitness
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Entrepreneurship
					</button>
				</div>
			</div>

			<div className="py-5 border-b border-darkHighlight last:border-none">
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
					<button className="items-center border border-whiteSecondary text-[14px] rounded-full px-2.5 py-1 text-opacity-80">
						Follow
					</button>
				</div>
				<p className="text-sm my-2">Helping you strenthen your will power and understand brain functioning.</p>
				<div className="flex gap-1 items-center flex-wrap">
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Education
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Fitness
					</button>
					<button className="text-xs border border-whitePrimary text-opacity-20 px-2.5 py-1.5 rounded-full">
						Entrepreneurship
					</button>
				</div>
			</div>
		</div>
	)
}
