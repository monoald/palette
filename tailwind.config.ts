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
        main: "#111217",
        primary: "#1E2029",
        secondary: "#FFFFFF",
        tertiary: "#5BC3EB",
        "hover-secondary": "#CDCDCD1A",
      },
    },
  },
  plugins: [],
};
export default config;
