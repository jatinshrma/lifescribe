"use client"

import React, { useState, useCallback, createRef, useEffect } from "react"
import { CgClose } from "react-icons/cg"
import Cropper, { Area, MediaSize } from "react-easy-crop"
import Overlay from "./Overlay"
import { MdUpload } from "react-icons/md"
import axios from "axios"
import { useSession } from "next-auth/react"
import { IProfilePictureComponent } from "@types"

const ImageCrop = ({
	src,
	close,
	handleUpload
}: {
	src: string
	close: () => void
	handleUpload: (blob: Blob) => Promise<void>
}) => {
	const height = Math.ceil(window.innerHeight / 2)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [minZoom, setMinZoom] = useState(1)
	const [pixelCrop, setPixelCrop] = useState<Area>({
		width: 0,
		height: 0,
		x: 0,
		y: 0
	})

	const cropSize = {
		width: height,
		height: height
	}

	const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
		setPixelCrop(croppedAreaPixels)
	}, [])

	const getCroppedImg = async () => {
		const image: CanvasImageSource = await new Promise((resolve, reject) => {
			const image = new Image()
			image.addEventListener("load", () => resolve(image))
			image.addEventListener("error", error => reject(error))
			image.setAttribute("crossOrigin", "anonymous")
			image.src = src
		})
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")

		canvas.width = pixelCrop.width
		canvas.height = pixelCrop.height
		ctx?.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		)

		const blob = await new Promise((resolve, reject) => canvas?.toBlob(resolve))
		handleUpload(blob as Blob)
	}

	const setMediaSize = (size: MediaSize) => {
		const ratio = Math.max(size.height, height) / Math.min(size.height, height)
		setZoom(ratio)
		setMinZoom(ratio)
	}

	return (
		<Overlay>
			<div className="bg-darkPrimary rounded-xl">
				<div className="flex justify-between mx-6">
					<div className="my-4 space-y-1">
						<h2 className="text-xl font-semibold">Image Crop</h2>
						<p className="text-xs opacity-60">Crop your image to fit the square size</p>
					</div>
					<button className="text-2xl" onClick={close}>
						<CgClose />
					</button>
				</div>
				<div className={"relative aspect-video"} style={{ height: height + "px" }}>
					<Cropper
						image={src}
						aspect={1}
						crop={crop}
						zoom={zoom}
						minZoom={minZoom}
						cropSize={cropSize}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={onCropComplete}
						setMediaSize={setMediaSize}
						cropShape="round"
						style={{
							mediaStyle: {
								margin: "none"
							}
						}}
					/>
				</div>
				<button
					className="theme-button primary w-[50%] my-3 mx-auto group bg-darkHighlight hover:!bg-whitePrimary text-opacity-100 flex items-center justify-center gap-2"
					onClick={async () => {
						const result = await getCroppedImg()
						console.log({ result })
					}}
				>
					<MdUpload className="text-2xl group-hover:fill-darkPrimary" />
					<span className="font-medium group-hover:text-darkPrimary">Upload Image</span>
				</button>
			</div>
		</Overlay>
	)
}

export const ImageCropWrapper = ({ children }: { children: (x: IProfilePictureComponent) => React.ReactNode }) => {
	const { data: session } = useSession()
	const ref = createRef<HTMLInputElement>()
	const [state, setState] = useState<{
		cropImage?: boolean
		dataUrl?: string
		fileUrl?: string
	}>({})

	useEffect(() => {
		if (session?.user.image) setState({ fileUrl: session?.user.image })
	}, [session])

	const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
		const file = e.target.files?.[0]

		const imageDataUrl = await new Promise(resolve => {
			const reader = new FileReader()
			reader.addEventListener("load", () => resolve(reader.result), false)
			reader.readAsDataURL(file as Blob)
		})

		setState(prev => ({ ...prev, cropImage: true, dataUrl: imageDataUrl as string }))
	}

	const handleUpload = async (blob: Blob) => {
		const file = new File([blob], `profile-picture-${Date.now()}.${blob.type.split("/")[1]}`, {
			type: blob.type
		})

		const formData = new FormData()
		formData.append("type", "profile_picture")
		formData.append("file", file)

		const response = await axios.post("/api/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})

		setState({ fileUrl: response.data.file_url })
	}

	const handleDelete = async () => {}

	return (
		<>
			{children({
				url: state?.fileUrl,
				editFile: () => (state?.fileUrl ? setState(prev => ({ ...prev, cropImage: true })) : ref.current?.click()),
				changeFile: () => ref.current?.click(),
				deleteFile: handleDelete
			})}
			{state?.cropImage && (
				<ImageCrop
					src={state?.dataUrl || state?.fileUrl || ""}
					close={() => setState({})}
					handleUpload={handleUpload}
				/>
			)}
			<input ref={ref} type="file" accept="image/*" onChange={onFileChange} hidden />
		</>
	)
}

export default ImageCrop
