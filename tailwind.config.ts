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
        main: "#03050c",
        primary: "#181925",
        secondary: "#CDCDCD",
        tertiary: "#adde3b",
        "primary-border": "#E6E7F440",
        "secondary-border": "#E6E7F41A",
      },
      boxShadow: {
        "3xl": "0px 0px 15px rgb(0, 0, 0)",
      },
    },
  },
  plugins: [],
};
export default config;
