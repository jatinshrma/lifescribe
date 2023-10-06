import { IPromptParams } from "@utils/types"
import React from "react"

const Prompt = ({ warning, description, actions }: IPromptParams) => {
	return (
		<div className="prompt bg-darkPrimary p-6 w-[550px] ss:max-w-[720px] max-w-[80vw] rounded-xl">
			<h2 className="text-xl mb-4 font-semibold">
				{warning}
				{/* -{" "}<span className="text-lg font-normal">This blogpost and its associated media will be deleted permanently.</span> */}
			</h2>
			<p className=" mt-1 mb-5">
				<i className="opacity-60">{description}</i>
			</p>
			<div className="flex justify-end gap-6">
				{actions.map(action => (
					<button className={action?.classname} onClick={action?.handler}>
						{action?.label}
					</button>
				))}
			</div>
		</div>
	)
}

export default Prompt
