"use client"

import axios from "axios"
import React, { useState, useEffect } from "react"
import { ITag } from "@types"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Description } from "@headlessui/react"
import { BiX } from "react-icons/bi"
import { IoSearchOutline } from "react-icons/io5"

type TagsSelectionProps = {
	tags: string[]
	setTags: React.Dispatch<React.SetStateAction<string[]>>
}

const TagSelection = ({ tags, setTags }: TagsSelectionProps) => {
	const [query, setQuery] = useState("")
	const [tagsData, setTagsData] = useState<ITag[]>([])
	const filteredTagsList =
		!query || query?.length < 2
			? []
			: tagsData?.filter(
					tag => tag?.name?.toLowerCase().includes(query.toLowerCase()) && !tags?.includes(tag?._id as string)
			  )

	useEffect(() => {
		;(async () => {
			const tagsResponse = await axios.get("/api/tags")
			setTagsData(tagsResponse.data)
		})()
	}, [])

	return (
		<div className="mt-2 relative w-full space-y-2">
			<Combobox
				onChange={(value: string) => {
					setQuery("")
					if (value && tags?.length <= 5) {
						setTags((prev: string[]) => prev.concat([value]))
					}
				}}
			>
				<div className="theme-input relative hover:bg-darkHighlight rounded-md flex items-center gap-5 p-0">
					<IoSearchOutline className="text-lg absolute left-5 w-6" />
					<ComboboxInput
						className="text-sm w-full pl-14 pr-5 py-3"
						displayValue={() => query}
						onChange={event => setQuery(event.target.value)}
						placeholder="Search"
					/>
				</div>
				<Description className="text-sm text-white/50">
					Select your content related tags in a range of minimum 2 to maximum 5.
				</Description>
				<ComboboxOptions
					anchor="bottom start"
					transition={true}
					className={
						"w-[var(--input-width)] mt-2 rounded-xl border border-white/5 bg-darkSecondary p-1 [--anchor-gap:var(--spacing-1)] empty:invisible " +
						"transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
					}
				>
					{query?.length > 2 &&
						filteredTagsList?.map(tag => (
							<ComboboxOption
								key={tag._id?.toString()}
								value={tag._id}
								className="group theme-button static rounded-md transition-none select-none data-[focus]:bg-darkHighlight"
							>
								<div className="text-sm text-white">{tag.name}</div>
							</ComboboxOption>
						))}
				</ComboboxOptions>
			</Combobox>
			{tags?.length > 0 && (
				<div className="flex gap-2 flex-wrap">
					{tags.map(tag => (
						<div key={tag} className="theme-button static small rounded-md bg-darkSecondary w-fit">
							{tagsData?.find(i => i._id === tag)?.name}
							<BiX
								className="ml-1 h-5 w-5 cursor-pointer"
								onClick={() => setTags((prev: string[]) => prev.filter((_tag: string) => _tag !== tag))}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default TagSelection
