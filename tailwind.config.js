/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				darkPrimary: "var(--dark-primary)",
				darkSecondary: "var(--dark-secondary)",
				whiteSecondary: "var(--white-secondary)",
				whitePrimary: "var(--white-primary)"
			},
			fontFamily: {
				playFD: ["Playfair Display", "sans-serif"],
				lora: ["Lora", "serif"]
			}
		},
		screens: {
			xs: "480px",
			ss: "620px",
			sm: "768px",
			md: "1060px",
			lg: "1200px",
			xl: "1700px"
		}
	},
	plugins: []
}