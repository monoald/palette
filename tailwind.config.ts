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
        main: "#040409",
        primary: "#111428",
        secondary: "#CDCDCD",
        tertiary: "#735ceb",
        "primary-border": "#E6E7F440",
        "secondary-border": "#E6E7F41A",
      },
    },
  },
  plugins: [],
};
export default config;
