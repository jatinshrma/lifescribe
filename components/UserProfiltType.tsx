import React from "react"
import { FaUsers, FaUserShield } from "react-icons/fa6"

const values = [
	{
		value: false,
		Icon: FaUsers,
		heading: "Public Profile (User)",
		description:
			"Public profiles are known as Users. Users can publich posts which is publicly accessible, they can also maintain their personal writings such as their journals or other personal content."
	},
	{
		value: true,
		Icon: FaUserShield,
		heading: "Private Profile",
		description:
			"Users can use Lifescribe platform as private users to write and maintain personal writings and journals. Private profiles are hidden in searches and their contributions to public posts are anonymous."
	}
]

function UserProfiltType({ isPrivate, setIsPrivate }: { isPrivate: boolean; setIsPrivate: (x: boolean) => void }) {
	return (
		<>
			{values?.map(i => (
				<div
					className={
						"ss:px-10 ss:py-6 ss:rounded-3xl rounded-2xl py-5 px-6 cursor-pointer" +
						(isPrivate === i.value ? " bg-darkSecondary" : "")
					}
					onClick={() => setIsPrivate(i.value)}
				>
					<div className="mb-2 flex items-center gap-4">
						<i.Icon className="ss:w-8 ss:h-8 w-6 h-6" />
						<span className="ss:text-lg text-base font-medium">{i.heading}</span>
					</div>
					<p className="opacity-60 ss:text-base text-sm">{i.description}</p>
				</div>
			))}
		</>
	)
}

export default UserProfiltType
