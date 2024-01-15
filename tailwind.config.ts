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
        main: "#030308",
        primary: "#111428",
        secondary: "#EEEEEE",
        tertiary: "#5BC3EB",
        "hover-secondary": "#CDCDCD30",
      },
    },
  },
  plugins: [],
};
export default config;
