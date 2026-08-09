/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent1: '#e5d9f6',
        accent2: '#ffd2f3',
        accent3: '#fcdca6',
      }
    },
  },
  plugins: [],
}
