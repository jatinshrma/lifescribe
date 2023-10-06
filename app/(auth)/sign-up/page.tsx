"use client"

import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { HiOutlineEyeSlash } from "react-icons/hi2"
import { BiArrowBack } from "react-icons/bi"
import { useEffect, useState } from "react"
import { GoArrowRight } from "react-icons/go"
import { getProviders, getSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers/index"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react"

function SignUp() {
	const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
	useEffect(() => {
		;(async () => {
			const p = await getProviders()
			setProviders(p)
		})()
	}, [])

	const [stage, setStage] = useState(0)
	return (
		<div className="flex th-screen">
			<div className="bg-auth w-1/2 h-screen bg-cover bg-right" />
			<div className="w-1/2 max-h-screen overflow-auto">
				<div className="w-[60%] mx-auto pt-16 pb-8">
					{!stage ? (
						<div>
							<small className="text-lg">Welcome.</small>
							<h2 className="heading">Let's create your account</h2>
						</div>
					) : (
						<button className="text-xl flex items-center gap-2">
							<BiArrowBack />
							<span>Back</span>
						</button>
					)}
					<div className="mt-10 mb-6 flex gap-3 flex-col">
						{!stage ? (
							<>
								<input type="text" autoComplete={"off"} placeholder="Name" className="theme-input" />
								{/* Gender */}
								{/* DOB */}
							</>
						) : stage === 1 ? (
							<>
								<input type="email" autoComplete={"off"} placeholder="Email" className="theme-input" />
								<div className="passoword-field">
									<input type="password" autoComplete={"new-password"} placeholder="Password" className="theme-input" />
									<HiOutlineEyeSlash />
								</div>
								<div className="passoword-field">
									<input type="password" autoComplete={"new-password"} placeholder="Confirm Password" className="theme-input" />
									<HiOutlineEyeSlash />
								</div>
							</>
						) : (
							<>
								{/* Desktop Picture */}
								{/* About */}
								{/* Hide From Searches */}
							</>
						)}
					</div>
					{/* Sign Up */}
					<button className="theme-button relative" onClick={() => setStage(prev => prev + 1)}>
						{stage === 2 ? (
							"Sign Up"
						) : (
							<>
								Next
								<GoArrowRight className="absolute top-1/2 right-14 -translate-y-1/2 fill-darkSecondary text-2xl" />
							</>
						)}
					</button>

					<div className="my-5 text-xs text-center opacity-60">
						<span>
							Already have an account?{" "}
							<Link href={"/sign-in"} className="underline">
								sign in
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

export default SignUp
