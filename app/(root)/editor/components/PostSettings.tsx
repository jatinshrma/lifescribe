"use client"

import React, { useState, useEffect } from "react"
import { TbUpload } from "react-icons/tb"
import { IPost, IPostSubmitParams, ICollection, INewCollection, IVisibilityOption } from "@types"

import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Description,
	Field,
	Label
} from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa6"
import { BiCheck } from "react-icons/bi"

import { Radio, RadioGroup } from "@headlessui/react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { BsCheckCircleFill } from "react-icons/bs"
import { FiArrowLeft } from "react-icons/fi"
import { CgClose } from "react-icons/cg"
import { IoAdd, IoSearchOutline } from "react-icons/io5"
import { visibilityOptions } from "@helpers/constants"
import Button from "@components/Button"
import TagSelection from "./TagSelection"
import { useSession } from "next-auth/react"
import axios from "axios"
import { IoMdClose } from "react-icons/io"

const PostSettings = ({
	goBack,
	submit,
	post,
	isPublishing: isSaving
}: {
	goBack: () => void
	submit: (props: IPostSubmitParams) => void
	post: IPost | null
	isPublishing: boolean
}) => {
	const { data: session } = useSession()

	const [userCollections, setUserCollections] = useState<ICollection[]>([])
	const [query, setQuery] = useState("")
	const [tags, setTags] = useState<any>([])
	const [collection, setCollection] = useState<string>()
	const [isPrivate, setIsPrivate] = useState<boolean>(false)
	const [newCollection, setNewCollection] = useState<INewCollection | null>(null)
	const [flags, setFlags] = useState<{ fetchingCollections?: boolean }>({})

	useEffect(() => {
		if (session?.user.username)
			(async () => {
				setFlags({ fetchingCollections: true })
				const collectionsResponse = await axios.get("/api/collection", {
					params: {
						username: session?.user.username,
						visibilityInsensitive: 1
					}
				})

				if (collectionsResponse?.data) setUserCollections(collectionsResponse?.data)
				setFlags({})
			})()
	}, [session?.user])

	useEffect(() => {
		if (post) {
			setCollection(post?.user_collection?.toString() || "")
			setIsPrivate(post?.private)
			if (post?.tags?.length) setTags(post?.tags)
		}
	}, [post])

	const filteredCollections =
		query === ""
			? userCollections
			: userCollections.filter(coll => {
					return coll.name.toLowerCase().includes(query.toLowerCase())
			  })

	const collVisibilityIcon = (className: string) => {
		if (flags?.fetchingCollections) return <div className="custom-spinner w-4 h-4" />

		const coll = userCollections?.find(coll => coll._id === collection)
		if (!coll) return <IoSearchOutline className={className} />

		const Icon = visibilityOptions[+coll?.private || 0].Icon
		return <Icon className={className} />
	}

	const handleSubmit = () => {
		const params: IPostSubmitParams = { tags }

		if (newCollection || collection) {
			if (newCollection)
				params.newCollection = {
					name: newCollection.name || "",
					private: newCollection.private?.value || visibilityOptions[0].value
				}
			else if (collection) params.user_collection = collection
		} else params.private = isPrivate

		submit(params)
	}

	return (
		<div className="max-w-screen-md mx-auto ss:py-8 py-2">
			<button className="theme-button primary small flex items-center gap-1" onClick={goBack}>
				<FiArrowLeft />
				<span>Back</span>
			</button>

			<div className="flex my-6 gap-6 flex-wrap">
				<div className="ss:w-1/2 space-y-4">
					<Field>
						<Label className="text-sm font-medium mb-3 block">
							Collection <span className="opacity-50">(optional)</span>
						</Label>

						{!newCollection ? (
							<Combobox
								value={collection}
								onChange={(value: string) => setCollection(value)}
								onClose={() => setQuery("")}
							>
								<div className="relative flex items-center">
									<button className="pointer-events-none absolute inset-y-0 left-0 px-5">
										{collVisibilityIcon("size-4")}
									</button>
									<ComboboxInput
										className={
											"pl-[52px] pr-12 theme-input bg-darkSecondary hover:bg-darkHighlight " +
											"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
										}
										displayValue={value => userCollections.find(i => i._id === value)?.name as string}
										onChange={event => setQuery(event.target.value)}
									/>

									<div className="absolute inset-y-0 right-0 px-5 flex items-center">
										{Boolean(collection) && (
											<button
												className="px-5"
												type="button"
												onClick={() => {
													setCollection(undefined)
													setQuery("")
												}}
											>
												<IoMdClose />
											</button>
										)}
										<ComboboxButton className="group">
											<FaChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
										</ComboboxButton>
									</div>
								</div>

								<ComboboxOptions
									anchor="bottom"
									transition
									className={
										"w-[var(--input-width)] rounded-xl border border-white/5 bg-darkSecondary mt-1 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible " +
										"transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
									}
								>
									<ComboboxOption
										value={0}
										className="group w-full theme-button static rounded-md transition-none select-none data-[focus]:bg-darkHighlight"
										onClick={event => {
											event?.preventDefault()
											setNewCollection({ private: visibilityOptions[0], name: "" })
										}}
									>
										<IoAdd className="w-5 h-5 fill-white" />
										<div className="text-sm/6 text-white">Add new collection</div>
									</ComboboxOption>
									{filteredCollections.map(coll => {
										const Icon = visibilityOptions[+coll.private].Icon
										return (
											<ComboboxOption
												key={coll._id as React.Key}
												value={coll._id}
												className="group theme-button static rounded-md transition-none select-none data-[focus]:bg-darkHighlight"
											>
												<Icon className="w-5 h-5" />
												<div className="text-sm/6 w-full text-white">{coll.name}</div>
												<BiCheck className="invisible w-5 h-5 fill-white group-data-[selected]:visible" />
											</ComboboxOption>
										)
									})}
								</ComboboxOptions>
							</Combobox>
						) : (
							<div className="theme-input flex">
								<Menu>
									<MenuButton className={"flex items-center gap-1 mr-4"}>
										{newCollection?.private?.Icon && <newCollection.private.Icon className="w-5 h-5" />}
										<FaChevronDown className="w-2 h-2 fill-white/40 group-data-[hover]:fill-white" />
									</MenuButton>
									<MenuItems
										transition
										anchor="bottom start"
										className={
											"w-52 mt-2 rounded-xl border border-darkHighlight bg-darkSecondary p-1 text-sm text-whitePrimary transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
										}
									>
										{visibilityOptions.map((i: IVisibilityOption) => (
											<MenuItem key={"coll-op-" + i.label}>
												<button
													className={"theme-button primary gap-4 rounded-lg data-[focus]:bg-darkHighlight w-full"}
													onClick={() => setNewCollection(prev => ({ ...prev, private: i }))}
												>
													<i.Icon className="w-4 h-4" />
													<p className="font-semibold fill-whitePrimary">{i.label}</p>
												</button>
											</MenuItem>
										))}
									</MenuItems>
								</Menu>
								<input
									type="text"
									className="w-full theme-input p-0 !outline-none"
									placeholder="New collection name"
									value={newCollection?.name}
									onChange={event => setNewCollection(prev => ({ ...prev, name: event.target.value }))}
								/>

								<button
									className="rounded-md p-1.5 whitespace-nowrap flex hover:bg-darkHighlight scale-125"
									onClick={() => setNewCollection(null)}
								>
									<CgClose className="w-3 h-3" />
								</button>
							</div>
						)}
					</Field>

					<Field>
						<Label className="text-sm font-medium">Post's Visibility</Label>
						<Description className="text-sm text-white/50">
							Post's visibility is inherited from collection. In the absence of collection, post's visibility can
							be set independently.
						</Description>
						<RadioGroup
							value={isPrivate}
							onChange={setIsPrivate}
							aria-label="Visibility"
							className="mt-3 space-y-3"
						>
							{visibilityOptions.map((option: IVisibilityOption) => (
								<Radio
									key={option.label}
									value={option.value}
									className="group relative cursor-pointer w-full theme-button primary rounded-lg focus:outline-none data-[focus]:outline-1 data-[focus]:outline-whitePrimary data-[checked]:bg-darkSecondary data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
									disabled={Boolean(userCollections?.find(i => i._id === collection) || newCollection?.name)}
								>
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 text-sm/6">
											<option.Icon />
											<p className="font-semibold fill-whitePrimary">{option.label}</p>
										</div>
										<BsCheckCircleFill className="size-6 fill-whitePrimary text-opacity-100 opacity-0 transition group-data-[checked]:opacity-100" />
									</div>
								</Radio>
							))}
						</RadioGroup>
					</Field>
				</div>

				<div className="ss:w-1/2 space-y-4">
					<Field>
						<Label className="text-sm font-medium">Tags</Label>
						<TagSelection tags={tags} setTags={setTags} />
					</Field>
				</div>
			</div>

			<Button
				loading={isSaving}
				className="bg-whitePrimary text-darkPrimary font-medium ss:mb-0 ss:w-fit w-full justify-center mb-8"
				spinnerClassName="border-darkPrimary"
				Icon={TbUpload}
				iconsClassName="stroke-darkPrimary"
				onClick={handleSubmit}
			>
				<span className="text-darkPrimary text-sm">Save now</span>
			</Button>
		</div>
	)
}

export default PostSettings
