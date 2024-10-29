/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customGray : {
          100: "#302E2B",
          200: "#262522"
        },
        customBlue : {
          100: "#4B7399",
          200: "#3B5A78",
        },
      }
    },
  },
  plugins: [],
}