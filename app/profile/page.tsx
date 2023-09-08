"use client"

import React, { useEffect, useState } from "react"
import { signIn, signOut, useSession, getProviders } from "next-auth/react"
import Image from "next/image"
import { IBlogCardProps } from "@utils/types"
import axios from "axios"
import { BlogCard } from "@components"

const Profile = () => {
	const { data: session } = useSession()
	const [blogs, setBlogs] = useState<IBlogCardProps[]>([])

	useEffect(() => {
		// @ts-ignore
		if (session?.session_token) {
			;(async () => {
				const response = await axios({
					method: "get",
					url: "/api/blogpost",
					// @ts-ignore
					headers: { Authorization: `Bearer ${session?.session_token}` }
				})
				setBlogs(response.data)
			})()
		}
	}, [session])

	return (
		<div>
			<div className="flex items-center gap-20 pt-16 pb-[72px] px-10">
				<div>
					<Image className="object-cover rounded-full" src={session?.user?.image || ""} alt="user" width={256} height={256} />
				</div>
				<div>
					<h2 className="font-playFD text-4xl mb-3 font-medium">{session?.user?.name}</h2>
					<p className="font-lora">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa iure obcaecati veniam eaque, asperiores porro!
					</p>
					<div className="opacity-50 mt-6">
						<span className="pr-5 border-r border-[#7777777d]">{blogs?.length || 0} Published</span>
						<span className="pl-5">9 Saved</span>
					</div>
				</div>
			</div>
			<div>
				<button className="text-lg pb-3 highline opacity-50">
					<h2>Blogs</h2>
				</button>
				{/* <button>Saved</button> */}
			</div>
			<div className="py-10">
				{blogs?.map(blog => (
					<div key={blog._id.toString()}>
						<BlogCard {...blog} profile_view={true} />
						<hr className="opacity-[.05]" />
					</div>
				))}
			</div>
		</div>
	)
}

export default Profile
