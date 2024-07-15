"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, getProviders } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

const Navbar = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const pathname = usePathname()
	const { data: session } = useSession()
	const [providers, setProviders]: any = useState(null)

	useEffect(() => {
		;(async () => {
			const _providers = await getProviders()
			setProviders(_providers)
		})()
	}, [])

	const onClick = async () => {
		if (!providers?.google) return
		if (session) return router.push("/profile", { scroll: false })
		else router.push("/api/auth/signin", { scroll: false })
	}

	return (
		<nav className="flex justify-between items-center py-3.5 px-5 ss:p-5">
			<div className="flex items-center justify-between ss:gap-7 gap-3">
				<Link href="/">
					<button className="ss:text-3xl text-lg font-bold">LifeScribe</button>
				</Link>
			</div>
			<div className="flex gap-4 items-center">
				{children}
				<div className="relative ss:mr-2">
					<div className="rounded-full overflow-hidden">
						<Image
							className="object-cover sm:w-11 w-8 cursor-pointer"
							src={
								session?.user?.image ||
								`https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg`
							}
							alt="user"
							width={40}
							height={40}
							onClick={onClick}
						/>
					</div>
					{/* <div id="user-menu" className="hidden group-hover:block bg-darkSecondary overflow-hidden rounded-lg absolute right-0 mt-3">
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
					</div> */}
				</div>
			</div>
		</nav>
	)
}

export default Navbar
