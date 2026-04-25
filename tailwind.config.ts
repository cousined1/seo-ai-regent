import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#06B6D4",
          primaryHover: "#0891B2",
          primaryActive: "#0E7490",
          background: "#0A0A0A",
          surface: "#141414",
          border: "#2A2A2A",
          text: "#F2F2F2",
          textSecondary: "#8B8B8B",
        },
        score: {
          excellent: "#22C55E",
          good: "#84CC16",
          fair: "#F59E0B",
          poor: "#EF4444",
        },
      },
      fontFamily: {
        display: ["Geist", "sans-serif"],
        sans: ["Geist", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
