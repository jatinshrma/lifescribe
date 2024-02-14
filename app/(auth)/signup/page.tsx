"use client"

import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2"
import { BiArrowBack } from "react-icons/bi"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { GoArrowRight } from "react-icons/go"
import { getProviders, getSession } from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers/index"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react"
import Select from "@components/Select"
import Spinner, { spinnerTypes } from "@components/Spinner"

interface FormState {
	[key: string]: string
}

interface ValidateType {
	cond: (event: ChangeEvent<HTMLInputElement>) => Boolean
	message: string
}

interface ValidityConfigType {
	[key: string]: ValidateType
}

const genderOptions = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: "Prefer Not To Say", value: "-" }
]

function SignUp() {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null)
	useEffect(() => {
		;(async () => {
			const p = await getProviders()
			setProviders(p)
		})()
	}, [])

	const [flags, setFlags] = useState({
		loading: false,
		passVisible: false,
		cPassVisible: false
	})
	const [data, setData] = useState<FormState>()
	const [stage, setStage] = useState(0)
	const validityConfig: ValidityConfigType = {
		confirmPass: {
			cond: (e: ChangeEvent<HTMLInputElement>) => data?.password !== e.target.value,
			message: "Passwords must match"
		}
	}

	const onchange = (e: ChangeEvent<HTMLInputElement>, validate?: ValidateType) => {
		setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
		if (validate?.cond(e)) e.target.setCustomValidity(validate.message)
	}
	const onsubmit = (e: FormEvent) => {
		e.preventDefault()
		if (stage !== 1) return setStage(prev => prev + 1)
		setFlags(prev => ({ ...prev, loading: true }))
		setTimeout(() => {
			setFlags(prev => ({ ...prev, loading: false }))
		}, 3000)
	}

	return (
		<div className="flex th-screen">
			<div className="bg-auth w-1/2 h-screen bg-cover bg-right" />
			<div className="w-1/2 max-h-screen overflow-auto">
				<div className="w-[65%] mx-auto pt-14 pb-8">
					{!stage ? (
						<div>
							<small className="text-lg">Welcome.</small>
							<h2 className="heading">Let's create your account</h2>
						</div>
					) : (
						<button
							className="flex items-center gap-3"
							onClick={() => setStage(prev => prev - 1)}
							disabled={flags?.loading}
						>
							<BiArrowBack />
							<span>Back</span>
						</button>
					)}

					<form onSubmit={onsubmit}>
						<div className="mt-12 mb-8 flex gap-3 flex-col">
							{!stage ? (
								<>
									<input
										type="text"
										autoComplete={"off"}
										name="name"
										value={data?.name}
										onChange={onchange}
										placeholder="Name"
										className="theme-input"
										disabled={flags?.loading}
										required
									/>
									<input
										type="email"
										autoComplete={"off"}
										name="email"
										value={data?.email}
										onChange={onchange}
										placeholder="Email"
										className="theme-input"
										disabled={flags?.loading}
										required
									/>
									<div className="flex gap-3 relative">
										<Select
											options={genderOptions}
											placeholder={"Gender"}
											formField={"gender"}
											defaultSelection={data?.gender}
											onSelect={gender => setData(prev => ({ ...prev, gender }))}
											disabled={flags?.loading}
											required={true}
										/>
										<div className="theme-input flex items-center">
											<input
												type="date"
												className={`w-full dark:[color-scheme:dark] text-whiteSecondary ${
													data?.dob ? "" : "text-opacity-50"
												}`}
												name="dob"
												value={data?.dob}
												onChange={onchange}
												disabled={flags?.loading}
												required
											/>
										</div>
									</div>
								</>
							) : stage === 1 ? (
								<>
									<div className="passoword-field">
										<input
											type={flags?.passVisible ? "text" : "password"}
											autoComplete={"new-password"}
											placeholder="Password"
											name="password"
											value={data?.password}
											onChange={onchange}
											className="theme-input"
											disabled={flags?.loading}
											required
										/>
										{flags?.passVisible ? (
											<HiOutlineEye
												className="cursor-pointer"
												onClick={() => setFlags(prev => ({ ...prev, passVisible: false }))}
											/>
										) : (
											<HiOutlineEyeSlash
												className="cursor-pointer"
												onClick={() => setFlags(prev => ({ ...prev, passVisible: true }))}
											/>
										)}
									</div>
									<div className="passoword-field">
										<input
											type={flags?.cPassVisible ? "text" : "password"}
											autoComplete={"new-password"}
											placeholder="Confirm Password"
											name="confirm_password"
											value={data?.confirm_password}
											onChange={e => onchange(e, validityConfig.confirmPass)}
											className="theme-input"
											disabled={flags?.loading}
											required
										/>
										{flags?.cPassVisible ? (
											<HiOutlineEye
												className="cursor-pointer"
												onClick={() => setFlags(prev => ({ ...prev, cPassVisible: false }))}
											/>
										) : (
											<HiOutlineEyeSlash
												className="cursor-pointer"
												onClick={() => setFlags(prev => ({ ...prev, cPassVisible: true }))}
											/>
										)}
									</div>
								</>
							) : null}
						</div>
						<button type="submit" className="theme-button relative" disabled={flags?.loading}>
							{flags?.loading && <Spinner type={spinnerTypes.progressBar} />}
							{stage === 1 ? (
								"Sign Up"
							) : (
								<>
									Next
									<GoArrowRight className="absolute top-1/2 right-14 -translate-y-1/2 fill-darkSecondary text-2xl" />
								</>
							)}
						</button>
					</form>

					<div className="my-5 text-xs text-center opacity-60">
						<span>
							Already have an account?{" "}
							<Link
								href={"/signin"}
								className="underline"
								onClick={e => (flags?.loading ? null : e.preventDefault())}
							>
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
								<button
									className="flex items-center justify-center theme-button secondary gap-3"
									disabled={flags?.loading}
								>
									<FcGoogle className="w-6 h-6" />
									<span>Continue with {provider.name}</span>
								</button>
							</div>
						))}
					<div className="mt-6">
						<span className="text-xs text-whitePrimary text-opacity-50">
							By clicking Sign up or Continue with Google, you agree to our{" "}
							<span className="underline">Terms and Conditions</span> and{" "}
							<span className="underline">Privacy Statement</span>.
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SignUp
