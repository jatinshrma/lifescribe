import dynamic from "next/dynamic"
import { Dispatch, LegacyRef, SetStateAction } from "react"
import RQType from "react-quill"

interface QuillAttributes {
	forwardedRef: LegacyRef<RQType>
	id: string
	className: string
	theme: string
	value: string
	onChange: Dispatch<SetStateAction<string>>
	placeholder: string
	modules: {
		toolbar: {
			container: any[][]
			handlers: {
				image: Function
			}
		}
	}
}

const ReactQuill = dynamic(
	async () => {
		const { default: RQ } = await import("react-quill")
		return ({ forwardedRef, ...props }: QuillAttributes) => <RQ ref={forwardedRef} {...props} />
	},
	{
		ssr: false
	}
)

export default ReactQuill
