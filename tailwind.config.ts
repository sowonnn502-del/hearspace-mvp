import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111113",
        paper: "#f6f1e8",
        mist: "#d8d1c5",
        ember: "#b85c38",
        tide: "#315a66",
        moss: "#66735b",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Arial", "sans-serif"],
        serif: [
          "Noto Serif SC",
          "Source Han Serif SC",
          "Songti SC",
          "STSong",
          "SimSun",
          "serif",
        ],
        meta: ["Inter", "-apple-system", "BlinkMacSystemFont", "Arial", "sans-serif"],
      },
      boxShadow: {
        film: "0 24px 80px rgba(17, 17, 19, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
