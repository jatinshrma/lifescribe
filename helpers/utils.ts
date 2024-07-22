export const selectRandomIndexes = (totalCount: number, numIndexesToSelect: number) => {
	if (numIndexesToSelect > totalCount) {
		throw new Error("Number of indexes to select cannot be greater than the total count.")
	}

	const selectedIndexes = new Set()
	while (selectedIndexes.size < numIndexesToSelect) {
		selectedIndexes.add(Math.floor(Math.random() * totalCount))
	}

	return Array.from(selectedIndexes)
}

export const getRandomString = (len = 10) =>
	[...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("")

export const calculateAge = (dateString: Date, shortUnits) => {
	const units = ["day", "hour", "minute", "second"]
	const divisors = [86400000, 3600000, 60000, 1000]

	const elapsedDate = new Date(dateString)
	const elapsed = Date.now() - elapsedDate.getTime()

	if (elapsed >= divisors[0]) {
		const year = elapsedDate.getFullYear()
		const month = elapsedDate.toLocaleString("default", { month: "short" })
		const day = elapsedDate.getDate()
		return `on ${month} ${day}${year === new Date().getFullYear() ? "" : ", " + year}`
	}

	for (let i = 0; i < divisors.length; i++) {
		let value = Math.floor(elapsed / divisors[i])
		if (value >= 1) {
			const unit = shortUnits ? units[i]?.[0] : " " + units[i] + (value > 1 ? "s" : "")
			return `${value}${unit} ago`
		}
	}

	return "Just now"
}
