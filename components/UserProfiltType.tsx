import React from "react"
import { FaUsers, FaUserShield } from "react-icons/fa6"

function UserProfiltType({ isPrivate, setIsPrivate }: { isPrivate: boolean; setIsPrivate: (x: boolean) => void }) {
	return (
		<>
			<div
				className={"px-10 py-6 rounded-3xl cursor-pointer" + (!isPrivate ? " bg-darkSecondary" : "")}
				onClick={() => setIsPrivate(false)}
			>
				<div className="mb-2 flex items-center gap-4">
					<FaUsers className="w-8 h-8" />
					<span className="text-lg font-medium">Public Profile (Author)</span>
				</div>
				<p className="opacity-60">
					Public profiles are known as Authors. Authors can publich posts which is publicly accessible, they can
					also maintain their personal writings such as their journals or other personal content.
				</p>
			</div>
			<div
				className={"px-10 py-6 rounded-3xl cursor-pointer" + (isPrivate ? " bg-darkSecondary" : "")}
				onClick={() => setIsPrivate(true)}
			>
				<div className="mb-2 flex items-center gap-4">
					<FaUserShield className="w-8 h-8" />
					<span className="text-lg font-medium mb-2 block">Private Profile</span>
				</div>
				<p className="opacity-60">
					Users can use Lifescribe platform as private users to write and maintain personal writings and journals.
					Private profiles are hidden in searches and their contributions to public posts are anonymous.
				</p>
			</div>
		</>
	)
}

export default UserProfiltType
