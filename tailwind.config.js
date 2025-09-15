// tailwind.config.js
module.exports = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{html,js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', 'sans-serif'],
			},
			colors: {
				primary2: {
					DEFAULT: "#673ab7",
					light: "#673ab7",
					dark: "#673ab7",
					hover: "#8265c8"
				},
				primary: {
					DEFAULT: "#673ab7",
					light: "#673ab7",
					dark: "#673ab7"
				},
				input: {
					DEFAULT: "#e5e7eb",
					light: "#e5e7eb",
					dark: "#e5e7eb"
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}
