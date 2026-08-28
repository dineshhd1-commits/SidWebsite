import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FFF9F5",
        silk: {
          50: "#FFFDFB",
          100: "#FFF9F5",
          200: "#F4EFE6",
          300: "#E8DFD1",
          400: "#D7C7B2",
        },
        maroon: {
          50: "#EEF1F6",
          100: "#E2E8F0",
          200: "#CAD5E2",
          300: "#90A1B9",
          400: "#62748E",
          500: "#2D3748",
          600: "#1D293D",
          700: "#12182A",
          800: "#0F172B",
          900: "#0B0F19",
          950: "#07090F",
        },
        gold: {
          50: "#FCF9EE",
          100: "#F5ECCB",
          200: "#F0DFA0",
          300: "#E0C05A",
          400: "#C9A227",
          500: "#B8960C",
          600: "#96790A",
          700: "#785F08",
          800: "#5C4806",
          900: "#3D3004",
        },
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#046A38",
          800: "#034E28",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        cursive: ["var(--font-great-vibes)", "cursive"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 10px 40px -10px rgba(201, 162, 39, 0.3)",
        "maroon-glow": "0 10px 40px -10px rgba(11, 15, 25, 0.3)",
        "silk-card": "0 20px 40px -15px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
