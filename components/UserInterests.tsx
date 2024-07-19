import { interests } from "@helpers/constants"
import React from "react"

function UserInterests({
	userInterests,
	setUserInterests
}: {
	userInterests: string[]
	setUserInterests: (x: string[]) => void
}) {
	return (
		<div className="flex gap-3 flex-wrap">
			{interests?.map(i => (
				<button
					className={
						"theme-button medium rounded-full text-opacity-100 border " +
						(userInterests?.includes(i) ? "bg-whitePrimary text-darkPrimary" : "outlined hover:bg-darkSecondary")
					}
					onClick={() =>
						userInterests?.includes(i)
							? setUserInterests((userInterests || [])?.filter((_i: string) => _i !== i))
							: setUserInterests((userInterests || [])?.concat([i]))
					}
				>
					{i}
				</button>
			))}
		</div>
	)
}

export default UserInterests
