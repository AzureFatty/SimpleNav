/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/assets/conf/**/*.yml",
    ],
    safelist: [
        {
            pattern: /(bg|text|border)-(yellow|blue|pink|purple|indigo|cyan|green|red|orange)-(100|200|300|400|500|600|700|800|900)/,
            variants: ['group-hover', 'hover'],
        },
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
