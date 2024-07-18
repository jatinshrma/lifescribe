"use client"

import { interests } from "@helpers/constants"
import React, { createRef, useState } from "react"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"
import Image from "next/image"
import { FaUsers } from "react-icons/fa6"
import { FaUserShield } from "react-icons/fa6"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { BiChevronDown } from "react-icons/bi"
import { SlSymbolMale, SlSymbleFemale } from "react-icons/sl"
import { MdOutlineNotInterested } from "react-icons/md"
import { IoIosCheckmarkCircle } from "react-icons/io"
import ImageCrop, { ImageCropWrapper } from "@components/ImageCrop"
import axios from "axios"
import { RiDeleteBin7Line, RiImageAddLine } from "react-icons/ri"
import { IProfilePictureComponent } from "@types"

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

const genderOptions = [
	{ Icon: SlSymbolMale, type: "Male" },
	{ Icon: SlSymbleFemale, type: "Female" },
	{ Icon: () => <MdOutlineNotInterested className="w-5 h-5" />, type: "Prefer Not To Say" }
]

const Onboarding = () => {
	const [stage, setStage] = useState(0)
	const [profileType, setProfileType] = useState(1)
	const [selectedInterests, setSelectedInterests] = useState<string[]>([])
	const [selected, setSelected] = useState(genderOptions[0])

	return (
		<div id="onboarding" className="px-10 mx-auto mt-10">
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

			<div className="mt-7 z-10">
				{stage === 0 ? (
					<div className="mb-7 flex gap-3 flex-wrap">
						{interests?.map(i => (
							<button
								className={
									"theme-button medium rounded-full text-opacity-100 border " +
									(selectedInterests.includes(i)
										? "bg-whitePrimary text-darkPrimary"
										: "outlined hover:bg-darkSecondary")
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
					<>
						<div className="flex mx-auto max-w-screen-md h-[calc(100vh-93px)] overflow-auto">
							<div className="w-1/2 flex items-center justify-center sticky top-0 z-10">
								<ImageCropWrapper>
									{({ url, changeFile, editFile, deleteFile }: IProfilePictureComponent) => (
										<div>
											<div className="flex gap-4 mb-8">
												<button className="theme-button primary rounded-lg gap-2" onClick={changeFile}>
													<RiImageAddLine className="text-lg" />
													<span>Change</span>
												</button>
												<button
													className="theme-button primary rounded-lg gap-2 group hover:!bg-red-600/10"
													onClick={deleteFile}
												>
													<RiDeleteBin7Line className="text-lg group-hover:fill-red-600" />
													<span className="group-hover:text-red-600">Delete</span>
												</button>
											</div>
											<div className="w-64">
												<Image
													className="object-cover w-full cursor-pointer rounded-full"
													src={
														url ||
														`https://cdn.create.vista.com/api/media/small/224834772/stock-vector-user-icon-flat-style-person-icon-user-icon-web-site`
													}
													onClick={editFile}
													alt="user"
													width={256}
													height={256}
												/>
											</div>
										</div>
									)}
								</ImageCropWrapper>
							</div>
							<div className="w-1/2 px-12 rounded-lg space-y-4 z-0">
								<label className="block space-y-2">
									<span className="text-sm opacity-60">Username</span>
									<input type="text" className="theme-input" required />
								</label>
								<label className="block space-y-2">
									<span className="text-sm opacity-60">About</span>
									<textarea rows={4} className="theme-input resize-none" required />
								</label>
								<div>
									<div className="h-[.5px] w-full bg-slate-500/20 rounded-lg my-8" />
								</div>
								<label className="block space-y-2">
									<span className="text-sm opacity-60">Name</span>
									<input type="text" className="theme-input" required />
								</label>
								<label className="block space-y-2">
									<span className="text-sm opacity-60">Date of birth</span>
									<input type="date" className="theme-input dark:[color-scheme:dark]" required />
								</label>
								<label className="block space-y-2 pb-10">
									<span className="text-sm opacity-60">Gender</span>
									<Listbox value={selected} onChange={setSelected}>
										<ListboxButton
											className={
												"theme-input relative block w-full text-left " +
												"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-whitePrimary"
											}
										>
											<div className="flex gap-4 items-center">
												<selected.Icon className="size-4 fill-white" />
												<span>{selected.type}</span>
											</div>
											<BiChevronDown
												className="group pointer-events-none absolute h-full top-0 right-5 w-5 fill-white/60"
												aria-hidden="true"
											/>
										</ListboxButton>
										<ListboxOptions
											anchor="bottom"
											transition
											className={
												"w-[var(--button-width)] rounded-lg border border-darkHighlight bg-darkSecondary p-1 [--anchor-gap:4px] focus:outline-none " +
												"transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
											}
										>
											{genderOptions.map(gender => (
												<ListboxOption
													key={gender.type}
													value={gender}
													className="theme-input group flex justify-between cursor-default items-center gap-2 select-none data-[focus]:bg-darkHighlight"
												>
													<div className="flex gap-4 items-center">
														<gender.Icon className="size-4 fill-white" />
														<span>{gender.type}</span>
													</div>
													<IoIosCheckmarkCircle className="invisible w-5 h-5 fill-white group-data-[selected]:visible" />
												</ListboxOption>
											))}
										</ListboxOptions>
									</Listbox>
								</label>
							</div>
						</div>
					</>
				) : (
					<div className="mb-7 flex gap-4">
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
								can also maintain their personal writings such as their journals or other personal content.
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
		</div>
	)
}

export default Onboarding
