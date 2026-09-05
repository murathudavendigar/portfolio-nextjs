/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["var(--font-nunito-sans)", "sans-serif"],
        "mono-ui": ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        ink: "#211d1a",
        inkDeep: "#171412",
        paper: "#f3ede4",
        paperDeep: "#e6ddd0",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/typography")],
};
