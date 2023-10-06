"use client"

import React, { useState, useCallback } from "react"
import { CgClose } from "react-icons/cg"
import Cropper from "react-easy-crop"
import Overlay from "./Overlay"

const ImageCrop = ({
	src,
	close,
	uploadImage
}: {
	src: string
	close: () => void
	uploadImage: (blob: Blob) => Promise<void>
}) => {
	const height = Math.ceil(50 * (window.innerHeight / 100))
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [pixelCrop, setPixelCrop] = useState<any>(null)
	const cropSize = {
		width: height,
		height: height
	}

	const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
		setPixelCrop(croppedAreaPixels)
	}, [])

	const getCroppedImg = async () => {
		const image: any = await new Promise((resolve, reject) => {
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
		ctx?.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

		const blob = await new Promise((resolve, reject) => canvas?.toBlob(resolve))
		uploadImage(blob as Blob)
	}

	return (
		<Overlay>
			<div className="bg-darkPrimary rounded-xl">
				<div className="flex justify-between mx-3">
					<div>
						<h2 className="text-xl font-semibold mt-3 mb-1">Image Crop</h2>
						<p className="text-xs mb-3 opacity-60">Crop your image to fit the square size</p>
					</div>
					<button className="mr-2 text-2xl" onClick={close}>
						<CgClose />
					</button>
				</div>
				<div className={`relative max-w-[512px] w-[80vw]`} style={{ height: height + "px" }}>
					<Cropper
						image={src}
						crop={crop}
						zoom={zoom}
						aspect={1}
						cropSize={cropSize}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={onCropComplete}
					/>
				</div>
				<button
					className="py-2 w-[50%] m-3 mx-auto rounded-md block bg-darkSecondary"
					onClick={async () => {
						const result = await getCroppedImg()
						console.log({ result })
					}}
				>
					Select Image
				</button>
			</div>
		</Overlay>
	)
}

export default ImageCrop
