import { IVisibilityOption } from "@types"
import { FiLock } from "react-icons/fi"
import { TbWorld } from "react-icons/tb"

export const visibilityOptions: IVisibilityOption[] = [
	{ Icon: TbWorld, value: false, label: "Public" },
	{ Icon: FiLock, value: true, label: "Private" }
]

export const interests = []
