/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
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

        // shadcn/ui semantic tokens. Values live in styles/globals.css and are
        // inverted: :root is charcoal, .dark is paper.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Bare `border`/`border-t` in shadcn components expects the token. Every
      // pre-existing call site pairs `border` with an explicit color, so this
      // only affects the new components/ui files.
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
