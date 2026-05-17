/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a7ea4',
        background: '#f8f9fa',
        text: '#11181C',
        textLight: '#687076',
        success: '#28a745',
        danger: '#dc3545',
        cardBackground: '#ffffff',
        border: '#e1e4e8',
      }
    },
  },
  plugins: [],
}
