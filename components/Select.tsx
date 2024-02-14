import React, { useEffect, useState } from "react"
import BlurWatcher from "./BlurWatcher"
import { FaAngleDown } from "react-icons/fa6"

interface types {
	options: { value: string; label: string; disabled?: boolean }[]
	onSelect?: (param: string) => void | undefined
	defaultSelection?: string
	wrapperId?: string
	placeholder?: string
	formField?: string
	required?: boolean
	disabled?: boolean
}

const Select = ({
	options,
	onSelect,
	defaultSelection,
	wrapperId,
	placeholder,
	formField,
	required,
	disabled
}: types) => {
	const [dropDownState, setDropDownState] = useState<{
		selected?: string
		dropdown?: boolean
		filter?: string | null
	}>({
		selected: defaultSelection
	})
	useEffect(() => {
		setDropDownState(prev => ({ ...prev, selected: defaultSelection }))
	}, [defaultSelection])

	const filteredOptions = options?.filter(
		i =>
			!i.disabled &&
			(!dropDownState?.filter?.trim() || i?.label?.toLowerCase()?.includes(dropDownState.filter.toLowerCase()))
	)

	return (
		<BlurWatcher
			id={wrapperId}
			className={"theme-input select relative"}
			onClick={() =>
				!disabled && !dropDownState.dropdown && setDropDownState(i => ({ ...i, dropdown: !i.dropdown }))
			}
			onClickOutside={() => setDropDownState(i => ({ ...i, filter: null, dropdown: false }))}
			style={{ cursor: disabled ? "not-allowed" : "pointer" }}
		>
			{required === true ? (
				<input
					type="text"
					name={formField}
					value={options?.find(i => i.value === dropDownState.selected)?.label}
					onChange={e => ""}
					className="opacity-0 w-[1px] h-[1px] absolute bottom-0 left-1/2"
					required
				/>
			) : (
				<></>
			)}
			<div className="flex items-center justify-between">
				{dropDownState.dropdown ? (
					<input
						type="text"
						value={dropDownState.filter ?? options?.find(i => i.value === dropDownState.selected)?.label}
						onChange={e => setDropDownState(i => ({ ...i, filter: e.target.value }))}
						autoFocus={true}
						placeholder={placeholder}
						disabled={disabled}
						className="w-full"
					/>
				) : (
					<span
						style={{ pointerEvents: "none" }}
						className={"w-full " + (!dropDownState.selected ? "opacity-50" : "")}
					>
						{options?.find(i => i.value === dropDownState.selected)?.label || placeholder}
					</span>
				)}
				<FaAngleDown />
			</div>
			{dropDownState.dropdown ? (
				<div className="absolute left-0 theme-input top-full mt-1 z-10 flex flex-col items-start px-[0px!important] py-[10px!important]">
					{filteredOptions?.length ? (
						filteredOptions?.map(({ label, value }) => (
							<button
								className="py-2 px-4 hover:bg-darkPrimary w-full text-left"
								onClick={e => {
									e.stopPropagation()
									onSelect?.(value)
									setDropDownState({ selected: value })
								}}
							>
								{label}
							</button>
						))
					) : (
						<em className="font-xs" style={{ textAlign: "center" }}>
							No Match Found
						</em>
					)}
				</div>
			) : (
				<></>
			)}
		</BlurWatcher>
	)
}

export default Select
