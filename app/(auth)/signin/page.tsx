"use client"

import { FcGoogle } from "react-icons/fc"
import { IAuthPageProps } from "@utils/types"
import { AiOutlineArrowRight } from "react-icons/ai"
import { BsArrowRight } from "react-icons/bs"
import Link from "next/link"
import { HiOutlineEyeSlash } from "react-icons/hi2"
import { ClientSafeProvider, LiteralUnion, getProviders, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { BuiltInProviderType } from "next-auth/providers/index"
import { FaApple, FaFacebook, FaFacebookF, FaLinkedin, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"

function SignIn() {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>()

	useEffect(() => {
		;(async () => {
			const p = await getProviders()
			setProviders(p)
		})()
	}, [])

	const [flags, setFlags] = useState<{ loading: boolean }>()

	return (
		<div className="flex h-screen">
			<div className="bg-auth w-1/2 h-screen bg-cover bg-right" />
			<div className="w-1/2 max-h-screen overflow-auto">
				<div className="w-[65%] mx-auto pt-16 pb-8">
					<small className="text-base">Welcome.</small>
					<h2 className="heading">Sign into your account</h2>
					<div className="mt-12 mb-6 flex gap-3 flex-col">
						{Object.values(providers || {})
							.filter(i => i.name !== "Credentials")
							.map(provider => (
								<div className="flex gap-3 flex-col">
									<div key={provider.name}>
										<button
											className="flex items-center theme-button bg-[var(--dark-secondary)!important] gap-3"
											disabled={flags?.loading}
										>
											<FcGoogle className="w-7 h-7 ml-[25%]" />
											<span className="text-fontSecondary font-normal">Continue with {provider.name}</span>
										</button>
									</div>
									{/* <div key={provider.name}>
										<button
											className="flex items-center theme-button bg-[var(--dark-secondary)!important] gap-3"
											disabled={flags?.loading}
										>
											<FaApple className="w-7 h-7 ml-[25%] fill-darkSecondary" />
											<span className="text-fontSecondary font-normal">Continue with Apple</span>
										</button>
									</div> */}
									<div key={provider.name}>
										<button
											className="flex items-center theme-button bg-[var(--dark-secondary)!important] gap-3"
											disabled={flags?.loading}
										>
											{/* <FaFacebook className="w-7 h-7 fill-[#3b5999] ml-[25%]" /> */}
											{/* className="w-7 h-7 ml-[25%]" */}
											<FacebookIcon />
											<span className="text-fontSecondary font-normal">Continue with Facebook</span>
										</button>
									</div>
									<div key={provider.name}>
										<button
											className="flex items-center theme-button bg-[var(--dark-secondary)!important] gap-3"
											disabled={flags?.loading}
										>
											<LinkedInIcon />
											<span className="text-fontSecondary font-normal">Continue with LinkedIn</span>
										</button>
									</div>
									<div key={provider.name}>
										<button
											className="flex items-center theme-button bg-[var(--dark-secondary)!important] gap-3"
											disabled={flags?.loading}
										>
											<FaXTwitter className="w-7 h-5 ml-[25%] text-fontSecondary" />
											<span className="text-fontSecondary font-normal">Continue with Twitter</span>
										</button>
									</div>
								</div>
							))}
					</div>
					<div>
						<span className="text-xs text-whitePrimary text-opacity-50">
							By continuing, you agree to our <span className="underline">Terms of Service</span> and acknowledge
							you've read our <span className="underline">Privacy Policy</span>.
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

const FacebookIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0,0,256,256"
		className="w-7 h-7 ml-[25%]"
	>
		<defs>
			<linearGradient
				x1="9.993"
				y1="9.993"
				x2="40.615"
				y2="40.615"
				gradientUnits="userSpaceOnUse"
				id="color-1_uLWV5A9vXIPu_gr1"
			>
				<stop offset="0" stop-color="#2aa4f4"></stop>
				<stop offset="1" stop-color="#007ad9"></stop>
			</linearGradient>
		</defs>
		<g transform="translate(-24.32,-24.32) scale(1.19,1.19)">
			<g
				fill="none"
				fill-rule="nonzero"
				stroke="none"
				stroke-width="1"
				stroke-linecap="butt"
				stroke-linejoin="miter"
				stroke-miterlimit="10"
				stroke-dasharray=""
				stroke-dashoffset="0"
				font-family="none"
				font-weight="none"
				font-size="none"
				text-anchor="none"
			>
				<g transform="scale(5.33333,5.33333)">
					<path
						d="M24,4c-11.046,0 -20,8.954 -20,20c0,11.046 8.954,20 20,20c11.046,0 20,-8.954 20,-20c0,-11.046 -8.954,-20 -20,-20z"
						fill="url(#color-1_uLWV5A9vXIPu_gr1)"
					></path>
					<path
						d="M26.707,29.301h5.176l0.813,-5.258h-5.989v-2.874c0,-2.184 0.714,-4.121 2.757,-4.121h3.283v-4.588c-0.577,-0.078 -1.797,-0.248 -4.102,-0.248c-4.814,0 -7.636,2.542 -7.636,8.334v3.498h-4.949v5.258h4.948v14.452c0.98,0.146 1.973,0.246 2.992,0.246c0.921,0 1.82,-0.084 2.707,-0.204z"
						fill="#ffffff"
					></path>
				</g>
			</g>
		</g>
	</svg>
)

const LinkedInIcon = () => (
	<svg
		className="w-7 h-7 ml-[25%]"
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0,0,256,256"
	>
		<g transform="translate(-38.4,-38.4) scale(1.3,1.3)">
			<g
				fill="none"
				fill-rule="nonzero"
				stroke="none"
				stroke-width="1"
				stroke-linecap="butt"
				stroke-linejoin="miter"
				stroke-miterlimit="10"
				stroke-dasharray=""
				stroke-dashoffset="0"
				font-family="none"
				font-weight="none"
				font-size="none"
				text-anchor="none"
				style={{ mixBlendMode: "normal" }}
			>
				<g transform="scale(5.33333,5.33333)">
					<path
						d="M42,37c0,2.762 -2.238,5 -5,5h-26c-2.761,0 -5,-2.238 -5,-5v-26c0,-2.762 2.239,-5 5,-5h26c2.762,0 5,2.238 5,5z"
						fill="#0078d4"
					></path>
					<path
						d="M30,37v-10.099c0,-1.689 -0.819,-2.698 -2.192,-2.698c-0.815,0 -1.414,0.459 -1.779,1.364c-0.017,0.064 -0.041,0.325 -0.031,1.114l0.002,10.319h-7v-19h7v1.061c1.022,-0.705 2.275,-1.061 3.738,-1.061c4.547,0 7.261,3.093 7.261,8.274l0.001,10.726zM11,37v-19h3.457c-2.003,0 -3.457,-1.472 -3.457,-3.501c0,-2.027 1.478,-3.499 3.514,-3.499c2.012,0 3.445,1.431 3.486,3.479c0,2.044 -1.479,3.521 -3.515,3.521h3.515v19z"
						fill="#000000"
						opacity="0.05"
					></path>
					<path
						d="M30.5,36.5v-9.599c0,-1.973 -1.031,-3.198 -2.692,-3.198c-1.295,0 -1.935,0.912 -2.243,1.677c-0.082,0.199 -0.071,0.989 -0.067,1.326l0.002,9.794h-6v-18h6v1.638c0.795,-0.823 2.075,-1.638 4.238,-1.638c4.233,0 6.761,2.906 6.761,7.774l0.001,10.226zM11.5,36.5v-18h6v18zM14.457,17.5c-1.713,0 -2.957,-1.262 -2.957,-3.001c0,-1.738 1.268,-2.999 3.014,-2.999c1.724,0 2.951,1.229 2.986,2.989c0,1.749 -1.268,3.011 -3.015,3.011z"
						fill="#000000"
						opacity="0.07"
					></path>
					<path
						d="M12,19h5v17h-5zM14.485,17h-0.028c-1.492,0 -2.457,-1.112 -2.457,-2.501c0,-1.419 0.995,-2.499 2.514,-2.499c1.521,0 2.458,1.08 2.486,2.499c0,1.388 -0.965,2.501 -2.515,2.501zM36,36h-5v-9.099c0,-2.198 -1.225,-3.698 -3.192,-3.698c-1.501,0 -2.313,1.012 -2.707,1.99c-0.144,0.35 -0.101,1.318 -0.101,1.807v9h-5v-17h5v2.616c0.721,-1.116 1.85,-2.616 4.738,-2.616c3.578,0 6.261,2.25 6.261,7.274l0.001,9.726z"
						fill="#ffffff"
					></path>
				</g>
			</g>
		</g>
	</svg>
)

// function SignIn() {
// 	const [providers, setProviders] = useState<Record<
// 		LiteralUnion<BuiltInProviderType, string>,
// 		ClientSafeProvider
// 	> | null>()
// 	useEffect(() => {
// 		;(async () => {
// 			const p = await getProviders()
// 			setProviders(p)
// 		})()
// 	}, [])

// 	return (
// 		<div className="flex h-screen">
// 			<div className="bg-auth w-1/2 h-screen bg-cover bg-right" />
// 			<div className="w-1/2 max-h-screen overflow-auto">
// 				<div className="w-[65%] mx-auto pt-16 pb-8">
// 					<small className="text-base">Welcome back.</small>
// 					<h2 className="heading">Log into your account</h2>
// 					<div className="mt-10 mb-6 flex gap-3 flex-col">
// 						<input type="text" autoComplete={"off"} placeholder="Email" className="theme-input" />
// 						<div className="passoword-field">
// 							<input
// 								type="password"
// 								autoComplete={"new-password"}
// 								placeholder="Password"
// 								className="theme-input"
// 							/>
// 							<HiOutlineEyeSlash />
// 						</div>
// 					</div>
// 					<button className="theme-button">Login</button>
// 					<div className="my-5 text-xs text-center opacity-60">
// 						<span>
// 							Don't have an account yet?{" "}
// 							<Link href={"/signup"} className="underline">
// 								sign up
// 							</Link>
// 						</span>
// 					</div>
// 					<div className="flex items-center justify-center gap-6 text-xs opacity-30 my-7">
// 						<hr className="w-14" />
// 						<span className="whitespace-nowrap">or</span>
// 						<hr className="w-14" />
// 					</div>
// 					{Object.values(providers || {})
// 						.filter(i => i.name !== "Credentials")
// 						.map(provider => (
// 							<div key={provider.name}>
// 								<button className="flex items-center justify-center theme-button secondary gap-3">
// 									<FcGoogle className="w-6 h-6" />
// 									<span>Continue with {provider.name}</span>
// 								</button>
// 							</div>
// 						))}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

export default SignIn
