"use client"

import { FcGoogle } from "react-icons/fc"
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from "next-auth/react"
import { Suspense, useEffect, useState } from "react"
import { BuiltInProviderType } from "next-auth/providers/index"
import { FaXTwitter } from "react-icons/fa6"
import { redirect } from "next/navigation"
import Loading from "@app/(root)/loading"

function SignIn() {
	const { data: session } = useSession()
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

	if (session) return redirect("/")
	return (
		<Suspense fallback={<Loading />}>
			<div className="flex h-screen">
				<div className="bg-auth ss:w-1/2 ss:block hidden h-screen bg-cover bg-right" />
				<div className="ss:w-1/2 w-full max-h-screen overflow-auto">
					<div className="ss:w-[65%] ss:mx-auto mx-5 pt-16 pb-8">
						<small className="ss:text-base text-lg">Welcome.</small>
						<h2 className="heading">Sign into your account</h2>
						<div className="mt-12 mb-6 flex gap-3 flex-col">
							{/* {Object.values(providers || {})
							.filter(i => i.name !== "Credentials")
							.map(provider => (
							))} */}
							<div className="flex gap-3 flex-col">
								<div>
									<button
										className="flex items-center justify-center auth-button dark gap-3"
										onClick={() => signIn("google")}
										disabled={flags?.loading}
									>
										<FcGoogle className="w-7 h-7" />
										<span className="text-fontSecondary font-normal">Continue with google</span>
									</button>
								</div>
								<div>
									<button
										className="flex items-center justify-center auth-button dark gap-3"
										disabled={flags?.loading}
									>
										<FacebookIcon />
										<span className="text-fontSecondary font-normal">Continue with Facebook</span>
									</button>
								</div>
								<div>
									<button
										className="flex items-center justify-center auth-button dark gap-3"
										disabled={flags?.loading}
									>
										<LinkedInIcon />
										<span className="text-fontSecondary font-normal">Continue with LinkedIn</span>
									</button>
								</div>
								<div>
									<button
										className="flex items-center justify-center auth-button dark gap-3"
										disabled={flags?.loading}
									>
										<GithubIcon />
										<span className="text-fontSecondary font-normal">Continue with Github</span>
									</button>
								</div>
								<div>
									<button
										className="flex items-center justify-center auth-button dark gap-3"
										disabled={flags?.loading}
									>
										<FaXTwitter className="w-7 h-6 text-fontSecondary" />
										<span className="text-fontSecondary font-normal">Continue with Twitter</span>
									</button>
								</div>
							</div>
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
		</Suspense>
	)
}

const GithubIcon = () => (
	<svg
		className="w-7 h-7"
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0,0,256,256"
	>
		<g transform="translate(-62.72,-62.72) scale(1.49,1.49)">
			<g
				fill="#FFFFFF"
				fillRule="nonzero"
				stroke="none"
				strokeWidth="1"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				strokeMiterlimit="10"
				strokeDasharray=""
				strokeDashoffset="0"
				fontFamily="none"
				fontWeight="none"
				fontSize="none"
				textAnchor="none"
				style={{ mixBlendMode: "normal" }}
			>
				<g transform="translate(0,2.10133) scale(3.55556,3.55556)">
					<path d="M36,12c13.255,0 24,10.745 24,24c0,10.656 -6.948,19.685 -16.559,22.818c0.003,-0.009 0.007,-0.022 0.007,-0.022c0,0 -1.62,-0.759 -1.586,-2.114c0.038,-1.491 0,-4.971 0,-6.248c0,-2.193 -1.388,-3.747 -1.388,-3.747c0,0 10.884,0.122 10.884,-11.491c0,-4.481 -2.342,-6.812 -2.342,-6.812c0,0 1.23,-4.784 -0.426,-6.812c-1.856,-0.2 -5.18,1.774 -6.6,2.697c0,0 -2.25,-0.922 -5.991,-0.922c-3.742,0 -5.991,0.922 -5.991,0.922c-1.419,-0.922 -4.744,-2.897 -6.6,-2.697c-1.656,2.029 -0.426,6.812 -0.426,6.812c0,0 -2.342,2.332 -2.342,6.812c0,11.613 10.884,11.491 10.884,11.491c0,0 -1.097,1.239 -1.336,3.061c-0.76,0.258 -1.877,0.576 -2.78,0.576c-2.362,0 -4.159,-2.296 -4.817,-3.358c-0.649,-1.048 -1.98,-1.927 -3.221,-1.927c-0.817,0 -1.216,0.409 -1.216,0.876c0,0.467 1.146,0.793 1.902,1.659c1.594,1.826 1.565,5.933 7.245,5.933c0.617,0 1.876,-0.152 2.823,-0.279c-0.006,1.293 -0.007,2.657 0.013,3.454c0.034,1.355 -1.586,2.114 -1.586,2.114c0,0 0.004,0.013 0.007,0.022c-9.61,-3.133 -16.558,-12.162 -16.558,-22.818c0,-13.255 10.745,-24 24,-24z"></path>
				</g>
			</g>
		</g>
	</svg>
)

const FacebookIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0,0,256,256"
		className="w-7 h-7"
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
				<stop offset="0" stopColor="#2aa4f4"></stop>
				<stop offset="1" stopColor="#007ad9"></stop>
			</linearGradient>
		</defs>
		<g transform="translate(-24.32,-24.32) scale(1.19,1.19)">
			<g
				fill="none"
				fillRule="nonzero"
				stroke="none"
				strokeWidth="1"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				strokeMiterlimit="10"
				strokeDasharray=""
				strokeDashoffset="0"
				fontFamily="none"
				fontWeight="none"
				fontSize="none"
				textAnchor="none"
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
		className="w-7 h-7"
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
				fillRule="nonzero"
				stroke="none"
				strokeWidth="1"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				strokeMiterlimit="10"
				strokeDasharray=""
				strokeDashoffset="0"
				fontFamily="none"
				fontWeight="none"
				fontSize="none"
				textAnchor="none"
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

export default SignIn
