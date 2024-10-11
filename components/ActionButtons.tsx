import axios from "axios"
import Link from "next/link"
import { AiOutlineDelete } from "react-icons/ai"
import { BiShare } from "react-icons/bi"
import { FaRegEye } from "react-icons/fa6"
import { GoBookmark, GoBookmarkSlash } from "react-icons/go"
import Prompt from "./Prompt"
import { useState } from "react"
import { RiQuillPenLine } from "react-icons/ri"

export const ShareButton = ({ url }: { url: string }) => (
	<button
		onClick={e => {
			e.preventDefault()
			navigator.clipboard.writeText(url)
		}}
		className="hover:scale-125 transition-transform ease-linear"
	>
		<BiShare className="hover:fill-blue-500 text-2xl" />
	</button>
)

export const ViewButton = ({ url }: { url: string }) => (
	<button className="hover:scale-125 transition-transform ease-linear">
		<Link href={url}>
			<FaRegEye className="hover:fill-amber-500 text-2xl" />
		</Link>
	</button>
)

export const EditButton = ({ url }: { url: string }) => (
	<button className="hover:scale-125 transition-transform ease-linear">
		<Link href={url}>
			<RiQuillPenLine className="hover:fill-amber-500 text-2xl" />
		</Link>
	</button>
)

export const DeleteButton = ({ postId, onDelete }: { postId: string; onDelete?: () => void }) => {
	const [state, setState] = useState(false)

	const deletePost = async () => {
		await axios.delete(`/api/post/${postId}`)
		onDelete?.()
	}

	return (
		<>
			<button
				onClick={e => {
					e.preventDefault()
					setState(true)
				}}
				className="hover:scale-125 transition-transform ease-linear"
			>
				<AiOutlineDelete className="hover:fill-red-500 text-2xl" />
			</button>
			<Prompt
				isOpen={state}
				onClose={() => setState(false)}
				warning="Delete Post"
				description="On confirm, this post and all the associated media will be deleted. This action is irreversible."
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

export const SaveButton = ({
	postId,
	isAdded,
	onUpdate
}: {
	postId: string
	isAdded: boolean
	onUpdate: (x: boolean) => void
}) => {
	const [loading, setLoading] = useState(false)
	const handleReadingList = async () => {
		try {
			setLoading(true)
			const response = await axios.post("/api/reading_list", {
				post_id: postId
			})
			if (response.data.success) {
				await onUpdate(response.data.updatedStatus)
			}
		} catch (error) {
			console.error(error)
		}
		setLoading(false)
	}

	return (
		<button
			className="hover:scale-125 transition-transform ease-linear"
			onClick={e => {
				e.preventDefault()
				handleReadingList()
			}}
		>
			{loading ? (
				<div className="custom-spinner w-5 h-5" />
			) : isAdded ? (
				<GoBookmarkSlash className="fill-yellow-500 text-xl scale-11" />
			) : (
				<GoBookmark className="hover:fill-yellow-500 text-xl scale-11" />
			)}
		</button>
	)
}
