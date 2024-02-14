import React from "react"

export const spinnerTypes = {
	progressBar: "progress-bar",
	spinner: "spinner"
}

interface Types {
	type: string
}

const Spinner = ({ type }: Types) => {
	return (
		<div className={`spinner-wrapper ${type}`}>
			<span className="loader" />
		</div>
	)
}

export default Spinner
