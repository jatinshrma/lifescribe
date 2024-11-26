"use client"

import React, { Suspense, useEffect, useState } from "react"
import { MdOutlineInterests } from "react-icons/md"
import { RiUserSettingsLine } from "react-icons/ri"
import { useSession } from "next-auth/react"
import axios from "axios"
import LayoutWrapper from "@components/LayoutWrapper"
import { IoShieldHalfSharp } from "react-icons/io5"
import UserInterests from "@components/UserInterests"
import UserProfileForm from "@components/UserProfileForm"
import UserProfiltType from "@components/UserProfiltType"
import { FaChevronRight } from "react-icons/fa6"
import Button from "@components/Button"
import { toast } from "react-toastify"
import { FiArrowLeft } from "react-icons/fi"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { useRouter } from "next/navigation"
import Loading from "../loading"

const tabsData = [
	{
		Icon: MdOutlineInterests,
		labels: {
			button: "Manage Interests",
			heading: "What are your interests?",
			info: "Select minimum 5 areas of your interest"
		}
	},
	{
		Icon: RiUserSettingsLine,
		labels: {
			button: "Edit Profile",
			heading: "Profile Details",
			info: "Complete your basic profile information"
		}
	},
	{
		Icon: IoShieldHalfSharp,
		labels: {
			button: "Profile Type",
			heading: "Profile Type",
			info: "You can always change this setting anytime"
		}
	}
]

const Settings = () => {
	const router = useRouter()
	const { data: session, update } = useSession()
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
	const [unModifiedUserData, setUnModifiedUserData] = useState<any>({})
	const [userData, setUserData] = useState<any>({})
	const [flags, setFlags] = useState<{ saving?: boolean }>({})
	const [isMobileView, setIsMobileView] = useState(false)

	useEffect(() => {
		setIsMobileView(window.innerWidth <= 620)
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
				const data = {
					...userResponse.data,
					dob: convertDOB(userResponse.data.dob)
				}
				setUserData(data)
				setUnModifiedUserData(data)
			})()
	}, [session])

	const handleSubmit = async () => {
		try {
			setFlags({ saving: true })
			const response = await axios.put("/api/user", {
				...userData,
				dob: typeof userData.dob === "string" ? new Date(userData.dob).toJSON() : userData.dob
			})
			if (response.data.success) {
				update()

				toast("Changes saved successfully!", {
					progressStyle: { backgroundColor: "white" }
				})

				if (isMobileView) {
					setUnModifiedUserData(userData)
					setSelectedIndex(null)
					setFlags({})
				} else {
					router.push("/")
				}
			}
		} catch (error) {
			setFlags({})
			console.error(error)
		}
	}

	const component = selectedIndex !== null ? tabsData[selectedIndex] : null
	const pageComponent =
		selectedIndex === 0 ? (
			<div className="mb-7">
				<UserInterests
					userInterests={userData?.interests}
					setUserInterests={value => setUserData((prev: any) => ({ ...prev, interests: value }))}
				/>
			</div>
		) : selectedIndex === 1 ? (
			<div className="flex ss:flex-row flex-col">
				<UserProfileForm
					userData={userData}
					setUserData={setUserData}
					classes={{
						leftComponent: "!items-start pt-3 ss:!sticky ss:!top-0",
						rightComponent: "ss:pl-4 pr-0 mx-2"
					}}
				/>
			</div>
		) : selectedIndex === 2 ? (
			<div className="space-y-4">
				<UserProfiltType
					isPrivate={Boolean(userData?.private)}
					setIsPrivate={(value: boolean) => setUserData((prev: any) => ({ ...prev, private: value }))}
				/>
			</div>
		) : null

	return (
		<Suspense fallback={<Loading />}>
			<LayoutWrapper>
				{isMobileView ? (
					<>
						<div className="flex items-center gap-3 mb-2">
							{selectedIndex !== null && (
								<button
									className="theme-button primary p-2"
									onClick={() => {
										setUserData(unModifiedUserData)
										setSelectedIndex(null)
									}}
								>
									<FiArrowLeft className="text-lg" />
								</button>
							)}
							<h1 className="heading">Settings</h1>
						</div>
						<div className="ss:hidden block relative">
							{component === null ? (
								<div>
									{tabsData?.map((i, idx) => (
										<div
											key={i.labels.button}
											className="theme-button w-full px-2 py-6 justify-between first:border-none border-t border-darkHighlight rounded-none"
											onClick={() => setSelectedIndex(idx)}
										>
											<div className="flex items-center gap-4">
												<i.Icon className="text-2xl" />
												<span>{i.labels.button}</span>
											</div>
											<FaChevronRight />
										</div>
									))}
								</div>
							) : (
								<>
									<div className="w-full h-[calc(100vh-5.5rem-80px)] overflow-auto">
										<div className="sticky top-0 flex justify-between items-center py-2 mt-2 bg-darkPrimary z-10">
											<div>
												<h2 className="sub-heading">{component.labels.heading}</h2>
												{component.labels.info && <span className="opacity-40">{component.labels.info}</span>}
											</div>
										</div>
										<div className="mt-5">{pageComponent}</div>
									</div>
									<Button
										loading={flags?.saving}
										spinnerClassName="border-darkPrimary"
										onClick={handleSubmit}
										className={"theme-button w-full bg-whitePrimary rounded-lg gap-3 justify-center"}
									>
										<span className="text-darkPrimary font-semibold block">Save Changes</span>
									</Button>
								</>
							)}
						</div>
					</>
				) : (
					<TabGroup
						className="flex gap-8"
						vertical
						selectedIndex={selectedIndex as number}
						onChange={setSelectedIndex}
					>
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

							<Button
								loading={flags?.saving}
								spinnerClassName="border-darkPrimary"
								onClick={handleSubmit}
								className={"theme-button w-full bg-whitePrimary rounded-lg gap-3 justify-center"}
							>
								<span className="text-darkPrimary font-semibold block">Save Changes</span>
							</Button>
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
									<div className="mt-7">{pageComponent}</div>
								</TabPanel>
							))}
						</TabPanels>
					</TabGroup>
				)}
			</LayoutWrapper>
		</Suspense>
	)
}

export default Settings
