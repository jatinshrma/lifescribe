import React, { useState } from "react"
import { FaCaretDown } from "react-icons/fa6"

export default function Popover({ Component, label, Icon }) {
	const [visible, setVisible] = useState(false)
	return (
		<div className="relative">
			<button className={"theme-button primary gap-4 px-4 py-3"} onClick={() => setVisible(i => !i)}>
				<div className="flex gap-2 items-center">
					{Icon && <Icon className="text-lg" />}
					<span>{label}</span>
				</div>
				<FaCaretDown className={"text-sm " + (visible ? "rotate-180" : "rotate-0")} />
			</button>
			{visible && (
				<div
					className="bg-darkSecondary absolute mt-4 -right-1/3 rounded-xl overflow-hidden"
					style={{ boxShadow: "0 0 1rem 0 #121212" }}
				>
					<Component />
				</div>
			)}
		</div>
	)
}
