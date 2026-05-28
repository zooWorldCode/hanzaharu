import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#57B72A",
        secondary: "#F8A24D",
        accent: "#5ECEAB",
      },
    },
  },
  plugins: [],
};

export default config;
