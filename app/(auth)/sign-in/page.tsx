"use client"

import { FcGoogle } from "react-icons/fc"
import { IAuthPageProps } from "@utils/types"
import { AiOutlineArrowRight } from "react-icons/ai"
import { BsArrowRight } from "react-icons/bs"
import Link from "next/link"
import { HiOutlineEyeSlash } from "react-icons/hi2"
import { getProviders, getSession } from "next-auth/react"
import { useEffect, useState } from "react"

function SignIn() {
	const [providers, setProviders] = useState()
	useEffect(() => {
		;(async () => {
			const p = await getProviders()
			setProviders(p)
		})()
	}, [])
	return (
		<div className="flex h-screen">
			<div className="bg-auth w-1/2 h-screen bg-cover bg-right"></div>
			<div className="w-1/2 max-h-screen overflow-auto">
				<div className="w-[55%] mx-auto pt-16 pb-8">
					<small className="text-base">Welcome back.</small>
					<h2 className="heading">Log into your account</h2>
					<div className="mt-10 mb-6 flex gap-3 flex-col">
						<input type="text" autoComplete={"off"} placeholder="Email" className="theme-input" />
						<div className="passoword-field">
							<input type="password" autoComplete={"new-password"} placeholder="Password" className="theme-input" />
							<HiOutlineEyeSlash />
						</div>
					</div>
					<button className="theme-button">Login</button>
					<div className="my-5 text-xs text-center opacity-60">
						<span>
							Don't have an account yet?{" "}
							<Link href={"/sign-up"} className="underline">
								sign up
							</Link>
						</span>
					</div>
					<div className="flex items-center justify-center gap-6 text-xs opacity-30 my-7">
						<hr className="w-14" />
						<span className="whitespace-nowrap">or</span>
						<hr className="w-14" />
					</div>
					{Object.values(providers || {})
						.filter(i => i.name !== "Credentials")
						.map(provider => (
							<div key={provider.name}>
								<button className="flex items-center justify-center theme-button secondary gap-3">
									<FcGoogle className="w-6 h-6" />
									<span>Continue with {provider.name}</span>
								</button>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default SignIn
