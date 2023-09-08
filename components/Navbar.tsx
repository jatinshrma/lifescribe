"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { FiSearch, FiLogOut } from "react-icons/fi"
import { PiNotePencilThin } from "react-icons/pi"
import { BiUser } from "react-icons/bi"
import Link from "next/link"
import { signIn, signOut, useSession, getProviders } from "next-auth/react"

const Navbar = () => {
	const { data: session } = useSession()
	const [providers, setProviders]: any = useState(null)
	const [toggleDropdown, setToggleDropdown] = useState(false)

	useEffect(() => {
		;(async () => {
			const _providers = await getProviders()
			setProviders(_providers)
		})()
	}, [])

	console.log({ session })

	const onClick = () => {
		if (!providers?.google) return
		if (session) setToggleDropdown(prev => !prev)
		else signIn(providers?.google?.id)
	}

	return (
		<nav className="flex justify-between items-center py-3.5 px-5 ss:p-5">
			<div className="flex items-center justify-between ss:gap-7 gap-3">
				<Link href="/">
					<button className="ss:text-3xl text-lg font-bold text-red-50">LifeScribe</button>
				</Link>
				<div className="nav__search">
					<span>
						<FiSearch className="ss:text-[22px] text-[1rem]" />
					</span>
					<input type="text" placeholder="Search Blogs" className="ss:w-60 w-32 text-sm" />
				</div>
			</div>
			<div className="flex gap-4 items-center">
				<Link href={"/editor"}>
					<button className="flex items-center gap-2 py-2 px-5 bg-darkSecondary rounded-full opacity-70">
						<PiNotePencilThin className="h-6 w-6" />
						<span>Write</span>
					</button>
				</Link>
				<div className="relative ss:mr-2">
					<div className="rounded-full overflow-hidden">
						<Image
							className="object-cover sm:w-8 w-6 cursor-pointer"
							src={
								session?.user?.image ||
								`https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg`
							}
							alt="user"
							width={32}
							height={32}
							onClick={onClick}
						/>
					</div>
					{toggleDropdown && (
						<div id="user-menu" className="bg-darkSecondary overflow-hidden rounded-lg absolute right-0 mt-3">
							<Link href={"/profile"}>
								<button>
									<BiUser />
									<span>Profile</span>
								</button>
							</Link>
							<button onClick={() => signOut()}>
								<FiLogOut />
								<span>Sign Out</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Navbar
