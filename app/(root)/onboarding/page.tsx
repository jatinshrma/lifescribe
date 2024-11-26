"use client"

import React, { useEffect, useState } from "react"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/navigation"
import UserInterests from "@components/UserInterests"
import UserProfileForm from "@components/UserProfileForm"
import UserProfiltType from "@components/UserProfiltType"

const stages = [
	{
		heading: "What are your interests?",
		info: "Select minimum 5 areas of your interest"
	},
	{
		heading: "Profile Details",
		info: "Complete your basic profile information"
	},
	{
		heading: "Profile Type",
		info: "You can always change this setting anytime"
	}
]

const Onboarding = () => {
	const router = useRouter()
	const { data: session, update } = useSession()
	const [stage, setStage] = useState(0)
	const [userData, setUserData] = useState<any>({})

	useEffect(() => {
		if (session?.user.username)
			(async () => {
				const convertDOB = (date: string) => {
					if (!date) return ""
					const _date = new Date(date)
					return [
						_date.getFullYear(),
						(_date.getMonth() + 1).toString().padStart(2, "0"),
						_date.getDate().toString().padStart(2, "0")
					].join("-")
				}

				const userResponse = await axios.get("/api/user", {
					params: { username: session?.user.username }
				})
				setUserData({
					...userResponse.data,
					dob: convertDOB(userResponse.data.dob)
				})
			})()
	}, [session])

	const handleSubmit = async () => {
		try {
			const response = await axios.put("/api/user", {
				...userData,
				originalUsername: session?.user.username,
				dob: typeof userData.dob === "string" ? new Date(userData.dob).toJSON() : userData.dob
			})
			if (response.data.success) {
				await update()
				router.push("/")
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div id="onboarding" className="ss:px-10 px-4 mx-auto ss:mt-10 mt-6">
			<h1 className="heading mb-2">Onboarding</h1>

			<div className="flex gap-4 my-3 py-4 sticky top-0 bg-darkPrimary">
				{Array(3)
					.fill(0)
					.map((_, idx) => (
						<div
							className={
								"h-1 rounded-lg w-1/3 bg-darkSecondary" +
								(stage >= idx ? " !bg-whitePrimary text-opacity-100" : "")
							}
						/>
					))}
			</div>
			<div className="flex justify-between items-center sticky top-9 bg-darkPrimary">
				<div>
					<h2 className="sub-heading">{stages[stage]?.heading}</h2>
					{stages[stage]?.info && <span className="opacity-40 ss:text-base text-sm">{stages[stage].info}</span>}
				</div>
				<div className="flex gap-4">
					{stage > 0 && (
						<button
							onClick={() => setStage(prev => (prev > 0 ? prev - 1 : prev))}
							className={`p-3 border border-whitePrimary rounded-full text-opacity-100 flex items-center gap-3`}
						>
							<LuArrowLeft className="stroke-whitePrimary text-opacity-100 text-lg" />
						</button>
					)}
					<button
						onClick={() => (stage === 2 ? handleSubmit() : setStage(prev => (prev < 2 ? prev + 1 : prev)))}
						className={`p-3 bg-whitePrimary rounded-full text-opacity-100 flex items-center gap-2 ${
							userData?.interests?.length > 2 ? "" : "--opacity-30"
						}`}
					>
						{stage === 2 && (
							<span className="ss:block hidden text-darkPrimary text-sm font-medium pl-2">View Profile</span>
						)}
						<LuArrowRight className="stroke-darkPrimary text-lg" />
					</button>
				</div>
			</div>

			<div className="mt-7 z-10">
				{stage === 0 ? (
					<div className="mb-7">
						<UserInterests
							userInterests={userData?.interests}
							setUserInterests={value => setUserData((prev: any) => ({ ...prev, interests: value }))}
						/>
					</div>
				) : stage === 1 ? (
					<div className="flex ss:flex-row flex-col mx-auto max-w-screen-md h-[calc(100vh-93px)] overflow-auto">
						<UserProfileForm
							userData={userData}
							setUserData={setUserData}
							classes={{
								rightComponent: "ss:px-12 mx-1"
							}}
						/>
					</div>
				) : (
					<div className="mb-7 flex ss:flex-nowrap flex-wrap ss:gap-4">
						<UserProfiltType
							isPrivate={Boolean(userData?.private)}
							setIsPrivate={(value: boolean) => setUserData((prev: any) => ({ ...prev, private: value }))}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default Onboarding
