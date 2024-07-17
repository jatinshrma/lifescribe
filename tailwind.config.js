/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: [
		"./index.html",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			colors: {
				darkPrimary: "var(--dark-primary)",
				darkSecondary: "var(--dark-secondary)",
				darkHighlight: "var(--dark-highlight)",
				whiteSecondary: "rgb(var(--white-secondary) / var(--tw-text-opacity))",
				whitePrimary: "rgb(var(--white-primary) / var(--tw-text-opacity))",
				whiteBright: "rgb(var(--white-bright) / var(--tw-text-opacity))"
			},
			fontFamily: {
				playFD: ["Playfair Display", "sans-serif"],
				lora: ["Lora", "serif"]
			},
			backgroundImage: {
				auth: "url(https://images.unsplash.com/photo-1637775297509-19767f6fc225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1854&q=80)"
			},
			borderRadius: {
				"4xl": "1.5rem",
				"5xl": "2rem"
			},
			text: {
				rem: "1rem"
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
