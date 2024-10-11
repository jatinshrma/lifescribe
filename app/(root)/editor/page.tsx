"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"

import axios from "axios"
import React, { useState, useEffect, useMemo, useRef, MutableRefObject, Suspense } from "react"
import { TbUpload } from "react-icons/tb"
import ReactQuill from "@components/ReactQuill"
import RQType from "react-quill"
import "react-quill/dist/quill.snow.css"
import { IPost, IPostSubmitParams, ICollection, INewCollection, IVisibilityOption, ITag } from "@types"

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
import { BiCheck, BiX } from "react-icons/bi"

import { Radio, RadioGroup } from "@headlessui/react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { BsCheckCircleFill } from "react-icons/bs"
import { FiArrowLeft } from "react-icons/fi"
import { CgClose } from "react-icons/cg"
import { IoAdd, IoSearchOutline } from "react-icons/io5"
import { tagsList, visibilityOptions } from "@helpers/constants"
import LayoutWrapper from "@components/LayoutWrapper"
import { useRouter } from "next/navigation"
import Button from "@components/Button"
import { toast } from "react-toastify"

const EditorComponent = () => {
	const searchParams = useSearchParams()
	const { data: session } = useSession()
	const [post, setPost] = useState<IPost | null>(null)
	const [userCollections, setUserCollections] = useState<ICollection[]>([])

	const router = useRouter()
	const postId = searchParams.get("id")

	const editorRef = useRef(null) as MutableRefObject<RQType> | MutableRefObject<null>
	const [state, setState] = useState<{
		contentLoading?: boolean
		publishing?: boolean
		state?: number
	}>({ state: 0 })

	useEffect(() => {
		if (postId)
			(async () => {
				const response = await axios.get("/api/post/" + postId)
				setPost(response.data)
			})()
	}, [postId])

	useEffect(() => {
		if (session?.user.username)
			(async () => {
				const collectionsResponse = await axios.get("/api/collection", {
					params: {
						username: session?.user.username
					}
				})

				if (collectionsResponse?.data) setUserCollections(collectionsResponse?.data)
			})()
	}, [session?.user])

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
				fd.append("type", "blog_image")
				fd.append("file", file)

				const config = { headers: { "content-type": "multipart/form-data" } }
				const response = await axios.post("/api/upload", fd, config)

				if (response.status !== 200) return
				const index = editorRef?.current?.getEditor()?.getSelection()?.index || 0
				editorRef?.current?.getEditor().insertEmbed(index, "image", response.data.url)
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
		setPost(prev => ({ ...prev, title: e.target.value } as IPost))
	}

	const submitHandler = async (params: IPostSubmitParams) => {
		try {
			setState(prev => ({ ...prev, publishing: true }))

			const div = document.createElement("div")
			if (post?.content) div.innerHTML = post.content

			const words_count = Array.from(div.children, ({ textContent }) => textContent?.trim())
				.filter(Boolean)
				.join(" ").length

			const response = await axios({
				method: postId ? "PUT" : "POST",
				url: "/api/post" + (postId ? `/${postId}` : ""),
				data: {
					title: post?.title,
					content: post?.content,
					reading_time: Math.ceil(words_count / 200),
					...params
				}
			})

			const _postId = response.data.postId || postId
			if (_postId) {
				toast.success("Published your new post successfully!")
				router.push(`/post/${_postId}?title=${post?.title?.replaceAll(" ", "-")}`)
			}
		} catch (error) {
			setState(prev => ({ ...prev, publishing: false }))
		}
	}

	return (
		<LayoutWrapper
			navActions={
				state?.state === 0 && (
					<button
						className="theme-button bg-whitePrimary text-darkPrimary text-opacity-100 font-medium"
						onClick={() => setState(prev => ({ state: +Boolean(!prev.state) }))}
					>
						<TbUpload className="stroke-darkPrimary" />
						<span className="text-darkPrimary text-sm">Publish</span>
					</button>
				)
			}
		>
			<div className="ss:px-0 px-4">
				{state?.state === 0 ? (
					<div className="max-w-screen-sm mx-auto">
						<textarea
							rows={1}
							id="post__editor-title"
							placeholder="Title"
							value={post?.title}
							onChange={onChange}
						/>
						<ReactQuill
							id="editor"
							className="relative"
							theme="snow"
							value={post?.content || ""}
							onChange={text => setPost(prev => ({ ...prev, content: text } as IPost))}
							placeholder="Content..."
							modules={modules}
							forwardedRef={editorRef}
						/>
					</div>
				) : state?.state === 1 ? (
					<AdditionalDetails
						goBack={() => setState({ state: 0 })}
						isPublishing={Boolean(state?.publishing)}
						submit={submitHandler}
						userCollections={userCollections}
						post={post}
					/>
				) : null}
			</div>
		</LayoutWrapper>
	)
}

function AdditionalDetails({
	goBack,
	submit,
	post,
	userCollections,
	isPublishing
}: {
	goBack: () => void
	submit: (props: IPostSubmitParams) => void
	post: IPost | null
	userCollections: ICollection[]
	isPublishing: boolean
}) {
	const [query, setQuery] = useState("")
	const [tags, setTags] = useState<any>([])
	const [collection, setCollection] = useState<string>()
	const [isPrivate, setIsPrivate] = useState<boolean>(false)
	const [newCollection, setNewCollection] = useState<INewCollection | null>(null)

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
		const coll = userCollections?.find(coll => coll._id === collection)
		if (!coll) return <IoSearchOutline className={className} />

		const Icon = visibilityOptions[+coll.private || 0].Icon
		return <Icon className={className} />
	}

	return (
		<div className="max-w-screen-md mx-auto py-8">
			<button className="theme-button primary small flex items-center gap-1" onClick={goBack}>
				<FiArrowLeft />
				<span>Back</span>
			</button>

			<div className="flex my-6 gap-6">
				<div className="w-1/2 space-y-4">
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
									<ComboboxOption
										value={"new"}
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
							Post's visibility is inhereted from collection. In the absence of collection, post's visibility can
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
				<div className="w-1/2 space-y-4">
					<Field>
						<Label className="text-sm font-medium">Tags</Label>
						<TagsSelection tags={tags} setTags={setTags} />
					</Field>
				</div>
			</div>

			<Button
				loading={isPublishing}
				className="bg-whitePrimary text-darkPrimary font-medium"
				spinnerClassName="border-darkPrimary"
				Icon={TbUpload}
				iconsClassName="stroke-darkPrimary"
				onClick={() => {
					const params: IPostSubmitParams = {
						tags
					}

					if (newCollection || collection) {
						if (newCollection)
							params.newCollection = {
								name: newCollection.name || "",
								private: newCollection.private?.value || visibilityOptions[0].value
							}
						else if (collection) params.user_collection = collection
					} else params.private = isPrivate

					submit(params)
				}}
			>
				<span className="text-darkPrimary text-sm">Publish now</span>
			</Button>
		</div>
	)
}

function TagsSelection({ tags, setTags }: TagsSelectionProps) {
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

type TagsSelectionProps = {
	tags: string[]
	setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export default function Editor() {
	return (
		<Suspense>
			<EditorComponent />
		</Suspense>
	)
}
