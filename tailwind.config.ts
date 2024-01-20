import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const customElements = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "text-shadow": (value) => ({
        textShadow: value,
      }),
    },
    { values: theme("textShadow") }
  );
});

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
        "transparent-main": "#03050CCC",
        primary: "#181925",
        secondary: "#CDCDCD",
        tertiary: "#89e1ebcc",
        "primary-border": "#E6E7F440",
        "secondary-border": "#E6E7F41A",
      },
      backgroundImage: {
        "btn-primary": "radial-gradient(circle, #15d2ff4d, #72faff4d 80%)",
      },
      boxShadow: {
        "3xl": "0px 0px 15px rgb(0, 0, 0)",
        active:
          "0 0 2px #72faff40, 0 0 5px #72faff40, 0 0 8px #72faff40, 0 0 16px #72faff40, 0 0 25px #15d2ff40, 0 0 5px #72faff60, 0 0 48px #15d2ff20",
        "btn-primary": "0 0 14px #57dfff4d",
      },
      textShadow: {
        active:
          "0 0 5px #72faff40, 0 0 15px #72faff40, 0 0 20px #72faff40, 0 0 40px #72faff40, 0 0 60px #15d2ff40, 0 0 10px #72faff60, 0 0 98px #15d2ff40",
      },
      keyframes: {
        "slide-left": {
          "0%": { left: "-320px", display: "block" },
          "100%": { left: "0px" },
        },
        "slide-right": {
          "0%": { left: "0px" },
          "100%": { left: "-320px", display: "none" },
        },
      },
      animation: {
        "slide-left": "slide-left 0.3s ease-in-out",
        "slide-right": "slide-right 0.3s ease-in-out",
      },
    },
  },
  plugins: [customElements],
};
export default config;
