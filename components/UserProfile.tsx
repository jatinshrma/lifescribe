import React from "react"
import { ImageCropWrapper } from "./ImageCrop"
import { IProfilePictureComponent } from "@types"
import { RiDeleteBin7Line, RiImageAddLine } from "react-icons/ri"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { BiChevronDown } from "react-icons/bi"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { SlSymbleFemale, SlSymbolMale } from "react-icons/sl"
import { MdOutlineNotInterested } from "react-icons/md"
import Image from "next/image"

const genderOptions = [
	{ Icon: SlSymbolMale, type: "Male" },
	{ Icon: SlSymbleFemale, type: "Female" },
	{ Icon: () => <MdOutlineNotInterested className="w-5 h-5" />, type: "Prefer Not To Say" }
]

function UserProfile({ userData, setUserData, classes }: any) {
	const GenderIcon = genderOptions.find(i => i.type === userData.gender)?.Icon

	return (
		<>
			<div
				className={"w-1/2 flex items-center justify-center sticky top-0 z-10 " + (classes?.leftComponent || "")}
			>
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
			<div className={"w-1/2 rounded-lg space-y-4 z-0 px-6 " + (classes?.rightComponent || "")}>
				<label className="block space-y-2">
					<span className="text-sm opacity-60">Username</span>
					<input
						type="text"
						className="theme-input"
						value={userData?.username || ""}
						onChange={e => setUserData((prev: any) => ({ ...prev, username: e.target.value }))}
						required
					/>
				</label>
				<label className="block space-y-2">
					<span className="text-sm opacity-60">About</span>
					<textarea
						rows={4}
						className="theme-input resize-none"
						value={userData?.about || ""}
						onChange={e => setUserData((prev: any) => ({ ...prev, about: e.target.value }))}
						required
					/>
				</label>
				<div>
					<div className="h-[.5px] w-full bg-slate-500/20 rounded-lg my-8" />
				</div>
				<label className="block space-y-2">
					<span className="text-sm opacity-60">Name</span>
					<input
						type="text"
						className="theme-input"
						value={userData?.name || ""}
						onChange={e => setUserData((prev: any) => ({ ...prev, name: e.target.value }))}
						required
					/>
				</label>
				<label className="block space-y-2">
					<span className="text-sm opacity-60">Date of birth</span>
					<input
						type="date"
						className="theme-input dark:[color-scheme:dark]"
						value={userData?.dob || ""}
						onChange={e => setUserData((prev: any) => ({ ...prev, dob: e.target.value }))}
						required
					/>
				</label>
				<label className="block space-y-2 pb-10">
					<span className="text-sm opacity-60">Gender</span>
					<Listbox
						value={userData.gender}
						onChange={value => setUserData((prev: any) => ({ ...prev, gender: value }))}
					>
						<ListboxButton
							className={
								"theme-input relative block w-full text-left " +
								"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-whitePrimary"
							}
						>
							<div className="flex gap-4 items-center">
								{GenderIcon && <GenderIcon className="size-4 fill-white" />}
								<span>{userData.gender || <span className="opacity-50">Select</span>}</span>
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
									value={gender.type}
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
		</>
	)
}

export default UserProfile
