/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        surface: "#1e293b",
        primary: "#3b82f6",
        secondary: "#6366f1",
        accent: "#10b981",
        danger: "#ef4444",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
