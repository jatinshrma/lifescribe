"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, getProviders, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { BiUser } from "react-icons/bi"
import { BsArrowRight } from "react-icons/bs"
import { LuSettings } from "react-icons/lu"
import Prompt from "./Prompt"
import { PiSignOutBold } from "react-icons/pi"

const Navbar = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter()
	const { data: session } = useSession()
	const [providers, setProviders]: any = useState(null)
	const [flags, setFlags] = useState<any>({})

	useEffect(() => {
		;(async () => {
			const _providers = await getProviders()
			setProviders(_providers)
		})()
	}, [])

	const handleSignOut = async () => {
		await signOut()
		setFlags({})
		router.push("/sign-in", { scroll: false })
	}

	return (
		<nav className="flex justify-between items-center gap-6 py-3.5 px-5 ss:p-5">
			<div className="flex items-center justify-between ss:gap-7 gap-3">
				<Link href="/">
					<button className="font-playFD ss:text-3xl text-lg font-bold">LifeScribe</button>
				</Link>
			</div>
			{/* <div className="flex items-center gap-3 rounded-full p-3 px-5 bg-darkSecondary w-[50vw]">
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
			</div> */}
			<div className="flex gap-4 items-center flex-shrink-0">
				{!session?.user.username ? (
					<Link
						href={"/sign-in"}
						className="absolute right-4 theme-button gap-0 hover:gap-3 whitespace-nowrap border border-darkHighlight hover:border-white/50 text-base font-medium tracking-wide font-playFD group"
					>
						Sign In
						<BsArrowRight className="text-lg w-[0px] group-hover:!w-[18px] transition-all ease-linear" />
					</Link>
				) : (
					<>
						{children}
						<Popover className="relative">
							<PopoverButton className="rounded-full overflow-hidden">
								<Image
									className="object-cover sm:w-11 w-8 pointer-events-none aspect-square"
									src={session?.user?.image || ""}
									alt="user"
									width={40}
									height={40}
								/>
							</PopoverButton>
							<PopoverPanel
								anchor="bottom end"
								className="w-52 mt-2 rounded-xl border border-darkHighlight bg-darkSecondary p-1 text-sm text-whitePrimary transition duration-100 ease-out [--anchor-gap:2px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
							>
								<Link
									href={"/user/" + session?.user?.username}
									className="theme-button primary gap-4 rounded-lg data-[focus]:bg-darkHighlight w-full"
								>
									<BiUser className="text-xl" />
									<span className="text-base">Profile</span>
								</Link>
								<Link
									href={"/settings"}
									className="theme-button primary gap-4 rounded-lg data-[focus]:bg-darkHighlight w-full"
								>
									<LuSettings className="text-xl" />
									<span className="text-base">Settings</span>
								</Link>
								<button
									className="theme-button primary gap-4 rounded-lg w-full"
									onClick={() => setFlags({ signOut: true })}
								>
									<PiSignOutBold className="text-xl" />
									<span className="text-base">Sign Out</span>
								</button>
							</PopoverPanel>
						</Popover>
					</>
				)}
			</div>

			<Prompt
				isOpen={Boolean(flags?.signOut)}
				onClose={() => setFlags({})}
				warning="Are you sure you want to sign out"
				description="After signing out you will be redirected to sign-in page. From there you can sign back into your account anytime."
				actions={[
					{
						label: "Sign out now!",
						handler: handleSignOut
					}
				]}
			/>
		</nav>
	)
}

export default Navbar
