import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { IPromptParams } from "@types"
import React from "react"
import Overlay from "./Overlay"

const Prompt = ({ isOpen, warning, description, actions, onClose }: IPromptParams) => {
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
			<Overlay>
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="w-full max-w-xl rounded-xl bg-darkSecondary p-6 backdrop-blur-2xl duration-200 ease-in data-[closed]:transform-[scale(85%)] data-[closed]:opacity-0"
					>
						<DialogTitle as="h3" className="text-lg/8 font-medium text-white">
							{warning}
						</DialogTitle>
						<p className="mt-3 text-base/7 text-white/50">{description}</p>
						<div className="mt-6 flex justify-end">
							{actions.map(action => (
								<Button
									className={
										"theme-button primary gap-2 rounded-md text-base/7 font-semibold shadow-inner focus:outline-none " +
										"!bg-red-900/10 text-red-600"
									}
									onClick={action?.handler}
								>
									{action?.label}
								</Button>
							))}
						</div>
					</DialogPanel>
				</div>
			</Overlay>
		</Dialog>
	)
}

export default Prompt
