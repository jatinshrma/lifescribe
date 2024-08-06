"use client"

import React, { useEffect, useState } from "react"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { MdOutlineInterests } from "react-icons/md"
import { RiUserSettingsLine } from "react-icons/ri"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/navigation"
import LayoutWrapper from "@components/LayoutWrapper"
import { IoShieldHalfSharp } from "react-icons/io5"
import UserInterests from "@components/UserInterests"
import UserProfileForm from "@components/UserProfileForm"
import UserProfiltType from "@components/UserProfiltType"
import { FaChevronRight } from "react-icons/fa6"

const Settings = () => {
	const router = useRouter()
	const { data: session, update } = useSession()
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

	const tabsData = [
		{
			Icon: MdOutlineInterests,
			labels: {
				button: "Manage Interests",
				heading: "What are your interests?",
				info: "Select minimum 5 areas of your interest"
			},
			Component: () => (
				<div className="mb-7">
					<UserInterests
						userInterests={userData?.interests}
						setUserInterests={value => setUserData((prev: any) => ({ ...prev, interests: value }))}
					/>
				</div>
			)
		},
		{
			Icon: RiUserSettingsLine,
			labels: {
				button: "Edit Profile",
				heading: "Profile Details",
				info: "Complete your basic profile information"
			},
			Component: () => (
				<div className="flex">
					<UserProfileForm
						userData={userData}
						setUserData={setUserData}
						classes={{
							leftComponent: "!items-start pt-3 !sticky !top-0",
							rightComponent: "pl-4 pr-0"
						}}
					/>
				</div>
			)
		},
		{
			Icon: IoShieldHalfSharp,
			labels: {
				button: "Profile Type",
				heading: "Profile Type",
				info: "You can always change this setting anytime"
			},
			Component: () => (
				<div className="space-y-4">
					<UserProfiltType
						isPrivate={Boolean(userData?.private)}
						setIsPrivate={(value: boolean) => setUserData((prev: any) => ({ ...prev, private: value }))}
					/>
				</div>
			)
		}
	]

	return (
		<LayoutWrapper>
			<TabGroup className="flex gap-8" vertical>
				<div className="w-1/3 sticky top-0 flex justify-between flex-col pb-3">
					<div>
						<h1 className="heading mb-2">Settings</h1>
						<TabList className="mt-7">
							{tabsData?.map(i => (
								<Tab
									key={i.labels.button}
									className="data-[selected]:bg-darkHighlight theme-button justify-between rounded-lg py-5 hover:bg-darkSecondary [&:hover+*]:border-transparent rouded-lg flex w-full"
								>
									<div className="flex items-center gap-4">
										<i.Icon className="text-2xl" />
										<span>{i.labels.button}</span>
									</div>
									<FaChevronRight />
								</Tab>
							))}
						</TabList>
					</div>

					<button
						onClick={handleSubmit}
						className={"theme-button w-full bg-whitePrimary text-opacity-100 rounded-lg gap-2 justify-center"}
					>
						<span className="text-darkPrimary font-medium pl-2 block">Save changes</span>
					</button>
				</div>
				<TabPanels className="w-2/3 overflow-auto h-[calc(100vh-90px)]">
					{tabsData?.map(i => (
						<TabPanel>
							<div className="flex justify-between items-center">
								<div>
									<h2 className="sub-heading">{i.labels.heading}</h2>
									{i.labels.info && <span className="opacity-40">{i.labels.info}</span>}
								</div>
							</div>
							<div className="mt-7">
								<i.Component />
							</div>
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</LayoutWrapper>
	)
}

export default Settings
