"use client"

import axios from "axios"
import React, { useState, useMemo, useRef, MutableRefObject } from "react"
import { TbUpload, TbWorld } from "react-icons/tb"
import ReactQuill from "@components/ReactQuill"
import RQType from "react-quill"
import "react-quill/dist/quill.snow.css"
import { IEditorProps } from "@utils/types"

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
import { FaArrowLeft, FaChevronDown } from "react-icons/fa6"
import { BiCheck } from "react-icons/bi"
import CustomAutocomplete from "./CustomAutocomplete"

import { Radio, RadioGroup } from "@headlessui/react"
import { BsArrowLeft, BsBack, BsCheckCircleFill } from "react-icons/bs"
import { FiArrowLeft, FiLock } from "react-icons/fi"
import LayoutWrapper from "./LayoutWrapper"
import { RiQuillPenLine } from "react-icons/ri"

const Editor = ({ blogContent, setBlogContent, title, setTitle, updateInDB }: IEditorProps) => {
	const editorRef = useRef(null) as MutableRefObject<RQType> | MutableRefObject<null>
	const [state, setState] = useState({ state: 0 })

	const imageHandler = () => {
		const input = document.createElement("input")
		input.setAttribute("type", "file")
		input.setAttribute("accept", "image/*")
		input.click()
		input.onchange = async () => {
			try {
				const file = input?.files?.[0]
				if (!file) return
				if (!/^image\//.test(file.type)) return console.warn("You could only upload images.")

				const fd = new FormData()
				fd.append("file", file)

				const config = { headers: { "content-type": "multipart/form-data" } }
				const response = await axios.post("/api/upload", fd, config)

				if (response.status !== 200) return
				const index = editorRef?.current?.getEditor()?.getSelection()?.index || 0
				editorRef?.current?.getEditor().insertEmbed(index, "image", response.data.file_url)
			} catch (error) {
				console.error("Error occurred in uploading image:", error)
			}
		}
	}

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					["bold", "italic", "underline"],
					[{ header: 2 }],
					[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
					[{ align: [] }],
					["link", "image", "blockquote", "code-block"]
				],
				handlers: {
					image: imageHandler
				}
			}
		}),
		[]
	)

	const onChange = (e: {
		target: { style: { height: string }; scrollHeight: any; value: React.SetStateAction<string> }
	}) => {
		e.target.style.height = "auto"
		e.target.style.height = `${e.target.scrollHeight}px`
		setTitle(e.target.value)
	}

	const publish = async () => {
		const div = document.createElement("div")
		div.innerHTML = blogContent
		const words_count = Array.from(div.children, ({ textContent }) => textContent?.trim())
			.filter(Boolean)
			.join(" ").length
		const reading_time = Math.ceil(words_count / 200)
		await updateInDB(reading_time)
	}

	return (
		<LayoutWrapper
			navActions={
				<button
					className="theme-button bg-whitePrimary text-darkPrimary text-opacity-100 font-medium"
					onClick={() => setState(prev => ({ state: +Boolean(!prev.state) }))}
				>
					<TbUpload className="stroke-darkPrimary" />
					<span className="text-darkPrimary text-sm">Publish</span>
				</button>
			}
		>
			<div className="ss:px-0 px-4">
				{state?.state === 0 ? (
					<div className="max-w-screen-sm mx-auto">
						<textarea rows={1} id="blog__editor-title" placeholder="Title" onChange={onChange} value={title} />
						<ReactQuill
							id="editor"
							className="relative"
							theme="snow"
							value={blogContent}
							onChange={setBlogContent}
							placeholder="Content..."
							modules={modules}
							forwardedRef={editorRef}
						/>
					</div>
				) : state?.state === 1 ? (
					<AdditionalDetails goBack={() => setState({ state: 0 })} />
				) : null}
			</div>
		</LayoutWrapper>
	)
}

const people = [
	{ id: 1, name: "Durward Reynolds" },
	{ id: 2, name: "Kenton Towne" },
	{ id: 3, name: "Therese Wunsch" },
	{ id: 4, name: "Benedict Kessler" },
	{ id: 5, name: "Katelyn Rohan" }
]

const visibilityOptions = [
	{ Icon: TbWorld, label: "Public" },
	{ Icon: FiLock, label: "Private" }
]

function AdditionalDetails({ goBack }) {
	const [query, setQuery] = useState("")
	const [selected, setSelected] = useState(people[1])

	const filteredPeople =
		query === ""
			? people
			: people.filter(person => {
					return person.name.toLowerCase().includes(query.toLowerCase())
			  })

	return (
		<div className="max-w-screen-md mx-auto py-8">
			<button className="theme-button primary small flex items-center gap-1" onClick={goBack}>
				<FiArrowLeft />
				<span>Back</span>
			</button>

			<div className="flex my-6 gap-6">
				<div className="w-1/2 space-y-4">
					<Field>
						<Label className="text-sm font-medium">Blogpost belong to collection:</Label>
						<Combobox value={selected} onChange={value => setSelected(value)} onClose={() => setQuery("")}>
							<div className="relative mt-3">
								<ComboboxInput
									className={
										"theme-input bg-darkSecondary hover:bg-darkHighlight " +
										"focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
									}
									displayValue={person => person?.name}
									onChange={event => setQuery(event.target.value)}
								/>
								<ComboboxButton className="group absolute inset-y-0 right-0 px-5">
									<FaChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
								</ComboboxButton>
							</div>

							<ComboboxOptions
								anchor="bottom"
								transition
								className={
									"w-[var(--input-width)] rounded-xl border border-white/5 bg-darkSecondary mt-1 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible " +
									"transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50"
								}
							>
								{filteredPeople.map(person => (
									<ComboboxOption
										key={person.id}
										value={person}
										className="group theme-button static rounded-md transition-none select-none data-[focus]:bg-darkHighlight"
									>
										<BiCheck className="invisible w-5 h-5 fill-white group-data-[selected]:visible" />
										<div className="text-sm/6 text-white">{person.name}</div>
									</ComboboxOption>
								))}
							</ComboboxOptions>
						</Combobox>
					</Field>

					<Field>
						<Label className="text-sm font-medium">Visibility</Label>
						<RadioGroup
							by="label"
							value={selected}
							onChange={setSelected}
							aria-label="visibility"
							className="mt-3 space-y-3"
						>
							{visibilityOptions.map(plan => (
								<Radio
									key={plan.label}
									value={plan}
									className="group relative cursor-pointer w-full theme-button primary rounded-lg focus:outline-none data-[focus]:outline-1 data-[focus]:outline-whitePrimary data-[checked]:bg-darkSecondary"
								>
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 text-sm/6">
											<plan.Icon />
											<p className="font-semibold fill-whitePrimary">{plan.label}</p>
										</div>
										<BsCheckCircleFill className="size-6 fill-whitePrimary text-opacity-100 opacity-0 transition group-data-[checked]:opacity-100" />
									</div>
								</Radio>
							))}
						</RadioGroup>
					</Field>
				</div>
				<div className="w-1/2 space-y-4">
					<Field>
						<Label className="text-sm font-medium">Tags</Label>
						<Description className="text-sm text-white/50">
							Select your blog related tags in a range of minimum 3 to maximum 10.
						</Description>
						<CustomAutocomplete />
					</Field>
				</div>
			</div>

			<button className="theme-button bg-whitePrimary text-darkPrimary text-opacity-100 font-medium">
				<TbUpload className="stroke-darkPrimary" />
				<span className="text-darkPrimary text-sm">Publish now</span>
			</button>
		</div>
	)
}

export default Editor
