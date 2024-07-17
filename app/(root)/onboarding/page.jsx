"use client"

import { interests } from "@utils/constants"
import React, { useState } from "react"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"
import Image from "next/image"
import { FaUsers } from "react-icons/fa6"
import { FaUserShield } from "react-icons/fa6"

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
	const [stage, setStage] = useState(0)
	const [profileType, setProfileType] = useState(1)
	const [selectedInterests, setSelectedInterests] = useState([])
	return (
		<div id="onboarding" className="pb-5">
			<h1 className="heading">Onboarding</h1>
			<div id="onboarding-progress">
				{Array(3)
					.fill(0)
					.map((_, idx) => (
						<div className={stage >= idx ? "filled" : ""} />
					))}
			</div>
			<div className="flex justify-between items-center">
				<div>
					<h2 className="sub-heading">{stages[stage]?.heading}</h2>
					{stages[stage]?.info && <span className="opacity-40">{stages[stage].info}</span>}
				</div>
				<div className="flex gap-4">
					{stage > 0 && (
						<button
							onClick={() => setStage(prev => prev - 1)}
							className={`p-3 border border-whitePrimary rounded-full text-opacity-100 flex items-center gap-3`}
						>
							<LuArrowLeft className="stroke-whitePrimary text-opacity-100 text-lg" />
						</button>
					)}
					<button
						onClick={() => setStage(prev => prev + 1)}
						className={`p-3 bg-whitePrimary rounded-full text-opacity-100 flex items-center gap-3 ${
							selectedInterests?.length > 2 ? "" : "--opacity-30"
						}`}
					>
						<LuArrowRight className="stroke-darkPrimary text-lg" />
					</button>
				</div>
			</div>
			{stage === 0 ? (
				<div className="my-6 flex gap-3 flex-wrap">
					{interests?.map(i => (
						<button
							className={
								"theme-button medium rounded-full text-opacity-100 border " +
								(selectedInterests.includes(i) ? "bg-whitePrimary text-darkPrimary" : "outlined")
							}
							onClick={() =>
								selectedInterests.includes(i)
									? setSelectedInterests(prev => prev.filter(_i => _i !== i))
									: setSelectedInterests(prev => prev.concat([i]))
							}
						>
							{i}
						</button>
					))}
				</div>
			) : stage === 1 ? (
				<div className="flex my-10 items-center">
					<div className="w-1/2">
						<div className="my-16">
							<div className="w-44 mx-auto mb-8">
								<Image
									className="object-cover w-full cursor-pointer rounded-full"
									src={`https://cdn.create.vista.com/api/media/small/224834772/stock-vector-user-icon-flat-style-person-icon-user-icon-web-site`}
									alt="user"
									width={200}
									height={200}
								/>
							</div>
						</div>
					</div>
					<div className="w-[.5px] self-stretch bg-whitePrimary text-opacity-20" />
					<div className="flex flex-col gap-4 w-1/2 ml-16">
						<label>
							<span className="text-sm opacity-60">Name</span>
							<input type="text" className="theme-input" required />
						</label>
						<label>
							<span className="text-sm opacity-60">DOB</span>
							<input type="date" className="theme-input dark:[color-scheme:dark]" required />
						</label>
						<label>
							<span className="text-sm opacity-60">Gender</span>
							<input type="text" className="theme-input" required />
						</label>
					</div>
				</div>
			) : (
				<div className="my-10 gap-4 flex flex-col">
					<div
						className={`px-10 py-6 rounded-3xl cursor-pointer ${profileType === 1 ? "bg-darkSecondary" : ""}`}
						onClick={() => setProfileType(1)}
					>
						<div className="mb-2 flex items-center gap-4">
							<FaUsers className="w-8 h-8" />
							<span className="text-lg font-medium">Public Profile (Author)</span>
						</div>
						<p className="opacity-60">
							Public profiles are known as Authors. Authors can publich posts which is publicly accessible, they
							can also maintain a record or personal writings such as their journals or other personal content.
						</p>
					</div>
					<div
						className={`px-10 py-6 rounded-3xl cursor-pointer ${profileType === 2 ? "bg-darkSecondary" : ""}`}
						onClick={() => setProfileType(2)}
					>
						<div className="mb-2 flex items-center gap-4">
							<FaUserShield className="w-8 h-8" />
							<span className="text-lg font-medium mb-2 block">Private Profile</span>
						</div>
						<p className="opacity-60">
							Users can use Lifescribe platform as private users to write and maintain personal writings and
							journals. Private profiles are hidden in searches and their contributions to public posts are
							anonymous.
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default Onboarding
