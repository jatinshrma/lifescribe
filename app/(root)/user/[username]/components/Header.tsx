"use client"

import React from "react"
import { Radio, RadioGroup } from "@headlessui/react"
import { ValuesStateType } from "../types"
import { FiArrowLeft } from "react-icons/fi"
import { viewOptions } from "../constants"

const Header = ({
	loading,
	state,
	changeState
}: {
	loading?: boolean
	state: ValuesStateType
	changeState: (values: { [x: string]: any }) => void
}) => {
	return (
		<div className="flex ss:flex-row flex-col ss:py-3 mt-3 pb-3 ss:gap-4 gap-3 ss:my-2 justify-between">
			<div className="ss:w-fit w-full">
				{state?.currCollection ? (
					<button
						disabled={loading}
						className="theme-button primary gap-2 ss:pl-3.5 pl-3"
						onClick={() => changeState({ currCollection: null })}
					>
						<FiArrowLeft className="ss:text-lg text-base" />
						<span className="ss:text-base text-sm">Back</span>
					</button>
				) : (
					<RadioGroup
						disabled={loading}
						aria-label="View"
						className="bg-darkSecondary rounded-full flex ss:w-fit w-full"
						value={state?.view}
						onChange={value => changeState({ view: value })}
					>
						{viewOptions.map(option => (
							<Radio
								disabled={loading}
								key={"tab-visibility:" + option?.type}
								value={option?.type}
								as={"button"}
								className="theme-button flex items-center gap-2 data-[checked]:bg-darkHighlight ss:w-fit w-full justify-center"
							>
								<option.Icon className="ss:text-base text-sm" />
								<span className="ss:text-base text-sm">{option?.type}</span>
							</Radio>
						))}
					</RadioGroup>
				)}
			</div>

			{/* <div className="flex items-stretch gap-4 w-full justify-end">
				<div className="ss:bg-darkSecondary ss:border-none border border-darkHighlight w-full pl-4 py-2 pr-2 rounded-full flex items-center gap-4">
					<input disabled={loading} type="text" placeholder="Search" className="w-full" />
					<button
						disabled={loading}
						className="h-full aspect-square flex items-center justify-center rounded-full text-opacity-100 group hover:bg-whitePrimary transition-colors duration-300 ease"
					>
						<RiSearchLine className="text-lg group-hover:fill-darkPrimary" />
					</button>
				</div>
			</div> */}
		</div>
	)
}

export default Header
