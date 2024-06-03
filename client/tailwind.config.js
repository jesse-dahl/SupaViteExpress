/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ACF0',
        secondary: '#38baed',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

