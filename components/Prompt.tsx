import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { IPromptParams } from "@types"
import React from "react"
import Overlay from "./Overlay"

const Prompt = ({ isOpen, warning, description, actions, onClose, children }: IPromptParams) => {
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
			<Overlay>
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="w-full max-w-xl rounded-xl bg-darkSecondary ss:p-6 p-4 backdrop-blur-2xl duration-200 ease-in data-[closed]:transform-[scale(85%)] data-[closed]:opacity-0"
					>
						<DialogTitle as="h3" className="ss:text-lg/8 text-base font-medium text-white">
							{warning}
						</DialogTitle>
						<p className="ss:mt-3 mt-2 ss:text-base/7 text-sm text-white/50">{description}</p>
						{children ? children : null}
						<div className="mt-6 flex justify-end">
							{actions.map(action => (
								<Button
									key={`prompt-action:${action.label}`}
									className={
										"theme-button primary gap-2 rounded-md ss:text-base/7 text-sm font-semibold shadow-inner focus:outline-none " +
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
