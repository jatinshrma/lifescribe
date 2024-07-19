/** @type {import('next').NextConfig} */
module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static.vecteezy.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "cdn.create.vista.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "randomuser.me",
				port: "",
				pathname: "/**"
			}
		]
	}
}
