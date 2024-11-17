import { PiNewspaperClipping } from "react-icons/pi"
import { BsCollection } from "react-icons/bs"

export const viewOptions = [
	{ Icon: (props: any) => <PiNewspaperClipping className={"text-xl " + props?.className} />, type: "Posts" },
	{ Icon: BsCollection, type: "Collections" }
]
