import axios from "axios"
import React, { useEffect, useState } from "react"

type Child = {
	_id: string
	name: string
}
type Interest = {
	_id: string
	name: string
	parents: [string]
	children: Child[]
}

function UserInterests({
	userInterests,
	setUserInterests
}: {
	userInterests: string[]
	setUserInterests: (x: string[]) => void
}) {
	const [interests, setInterests] = useState<Interest[]>()
	useEffect(() => {
		;(async () => {
			const interestsRes = await axios.get("/api/interests")
			setInterests(interestsRes.data)
		})()
	}, [])

	const onClick = (i: Interest | Child) =>
		userInterests?.includes(i._id)
			? setUserInterests((userInterests || [])?.filter((_i: string) => _i !== i._id))
			: setUserInterests((userInterests || [])?.concat([i._id]))

	return (
		<div className="flex ss:gap-3 gap-2 flex-wrap ss:justify-start justify-center">
			{interests?.map(i => (
				<>
					<InterestButton
						data={i}
						isSelected={Boolean(userInterests?.includes(i._id))}
						onClick={() => onClick(i)}
					/>
					{i.children?.map(child => (
						<InterestButton
							data={child}
							isSelected={Boolean(userInterests?.includes(child._id))}
							onClick={() => onClick(child)}
						/>
					))}
				</>
			))}
		</div>
	)
}

const InterestButton = ({
	data,
	isSelected,
	onClick
}: {
	data: Interest | Child
	isSelected: Boolean
	onClick: () => void
}) => (
	<button
		key={data._id}
		className={
			"theme-button medium rounded-full text-opacity-100 border ss:text-base text-sm " +
			(isSelected ? "bg-whitePrimary text-darkPrimary" : "outlined hover:bg-darkSecondary")
		}
		onClick={onClick}
	>
		{data.name}
	</button>
)

export default UserInterests
