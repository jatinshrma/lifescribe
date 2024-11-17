"use client"

import Prompt from "@components/Prompt"
import { ICollection } from "@types"
import axios from "axios"
import React, { useState } from "react"
import { BsCollection } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io"
// import { IoAdd } from "react-icons/io5"

const deleteOptions = [
	{ label: "Delete all posts permanently.", value: "-1" },
	{ label: "Make all posts public.", value: "0" },
	{ label: "Make all posts private.", value: "1" }
]

const DeleteButton = ({ collId, onDelete }: { collId: string; onDelete: (deleteOption: number) => void }) => {
	const [flags, setFlags] = useState<{
		loading?: boolean
		showPrompt?: boolean
	}>({})
	const [deleteOption, setDeleteOption] = useState(deleteOptions[0].value)

	const deletePost = async () => {
		try {
			setFlags({ loading: true })
			await axios.delete(`/api/collection`, {
				params: {
					deleteOption,
					collectionId: collId
				}
			})
			onDelete?.(+deleteOption)
		} catch (error) {}
		setFlags({})
	}

	return (
		<>
			<button
				disabled={flags?.loading}
				onClick={e => {
					e.stopPropagation()
					setFlags({ showPrompt: true })
				}}
				className="hover:scale-125 transition-transform ease-linear"
			>
				{flags?.loading ? (
					<div className="custom-spinner ss:w-6 ss:h-6 w-5 h-6 aspect-square pointer-events-none" />
				) : (
					<AiOutlineDelete className="hover:fill-red-500 ss:text-2xl text-xl" />
				)}
			</button>
			<Prompt
				isOpen={Boolean(flags?.showPrompt)}
				onClose={() => setFlags({})}
				warning="Delete Collection"
				description="On confirm, this collection will be permanently deleted and the posts under this collection will be processed according your choice below. This action is irreversible."
				children={
					<div className="mt-4 space-y-2">
						<span>How to process the posts under this collection?</span>
						{deleteOptions?.map(i => (
							<div className="flex gap-2.5 items-center cursor-pointer" onClick={() => setDeleteOption(i.value)}>
								{deleteOption === i.value ? (
									<IoMdRadioButtonOn className="text-xl" />
								) : (
									<IoMdRadioButtonOff className="text-xl" />
								)}
								<span className="text-base tracking-normal">{i.label}</span>
							</div>
						))}
					</div>
				}
				actions={[
					{
						label: "Yes, Delete",
						handler: deletePost
					}
				]}
			/>
		</>
	)
}

const Collections = ({
	collections,
	isAutherLoggedIn,
	onCollectionSelect,
	onDelete
}: {
	collections: ICollection[]
	isAutherLoggedIn: boolean
	onCollectionSelect: (value: { _id: string; name: string }) => void
	onDelete: (collId: string, deleteOption: number) => void
}) => {
	return (
		<div className="space-y-5">
			{collections?.length > 0 &&
				collections?.map(coll => (
					<div
						className="bg-darkSecondary ss:rounded-5xl rounded-3xl ss:p-8 p-6 cursor-pointer relative first:mt-0"
						onClick={() => onCollectionSelect({ _id: coll?._id as string, name: coll?.name })}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center ss:gap-4 gap-3">
								<BsCollection className="ss:text-2xl text-lg" />
								{coll?.created_at && (
									<span className="ss:text-sm text-xs opacity-60">
										{new Date(coll?.created_at as any)?.toDateString()}
									</span>
								)}
							</div>
							<div className="flex gap-5 items-center">
								{isAutherLoggedIn ? (
									<DeleteButton
										collId={coll._id as string}
										onDelete={(deleteOption: number) => onDelete(coll._id as string, deleteOption)}
									/>
								) : null}
							</div>
						</div>
						<p className="ss:my-5 my-4 ss:text-3xl text-2xl">{coll?.name}</p>
						<div className="ss:text-sm text-xs opacity-60 flex ss:gap-3 gap-2">
							<span>
								{coll?.total_posts} post{(coll?.total_posts as number) > 0 ? "s" : ""}
							</span>
							{coll?.recent_post && (
								<>
									<span>·</span>
									<span>Recent post at {new Date(coll?.recent_post as any).toDateString()}</span>
								</>
							)}
						</div>
						{/* {isAutherLoggedIn && (
							<button className="ss:p-3 p-2 rounded-full bg-whitePrimary text-opacity-100 absolute ss:right-8 right-6 bottom-5 transition-transform duration-200 ease-linear hover:scale-125">
								<IoAdd className="text-xl stroke-darkSecondary" />
							</button>
						)} */}
					</div>
				))}
		</div>
	)
}

export default Collections
