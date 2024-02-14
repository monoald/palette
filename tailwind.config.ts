import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const customElements = plugin(function ({ matchUtilities, theme, addVariant }) {
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
      screens: {
        bp: "662px",
        "color-bar": "472px",
      },
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
        "active-secondary":
          "0 0 2px #72faff40, 0 0 2px #72faff40, 0 0 4px #72faff40, 0 0 6px #72faff40, 0 0 13px #15d2ff40, 0 0 3px #72faff60, 0 0 20px #15d2ff20",
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
        "back-1": {
          "0%": { top: "10%", left: "15%", width: "90px", height: "60px" },
          "33%": { top: "60%", left: "75%", width: "80px", height: "100px" },
          "55%": { top: "80%", left: "35%", width: "50px", height: "150px" },
          "85%": { top: "30%", left: "55%", width: "100px", height: "80px" },
          "100%": { top: "10%", left: "15%", width: "90px", height: "60px" },
        },
        "back-2": {
          "0%": { top: "30%", right: "15%", width: "48px", height: "80px" },
          "22%": { top: "30%", right: "85%", width: "120px", height: "60px" },
          "47%": { top: "50%", right: "50%", width: "80px", height: "48px" },
          "70%": { top: "0%", right: "8%", width: "100px", height: "148px" },
          "100%": { top: "30%", right: "15%", width: "48px", height: "80px" },
        },
        "back-3": {
          "0%": { bottom: "30%", right: "40%", width: "40px", height: "80px" },
          "29%": {
            bottom: "80%",
            right: "40%",
            width: "80px",
            height: "148px",
          },
          "60%": {
            bottom: "60%",
            right: "80%",
            width: "130px",
            height: "30px",
          },
          "80%": {
            bottom: "20%",
            right: "70%",
            width: "60px",
            height: "108px",
          },
          "100%": {
            bottom: "30%",
            right: "40%",
            width: "40px",
            height: "80px",
          },
        },
        "back-4": {
          "0%": { bottom: "10%", left: "50%", width: "96px", height: "48px" },
          "25%": { bottom: "20%", left: "6%", width: "180px", height: "80px" },
          "55%": { bottom: "67%", left: "70%", width: "50px", height: "100px" },
          "77%": { bottom: "7%", left: "13%", width: "80px", height: "15px" },
          "100%": { bottom: "10%", left: "50%", width: "96px", height: "48px" },
        },
        "item-loading": {
          "0%": { opacity: "100%" },
          "50%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
      },
      animation: {
        "slide-left": "slide-left 0.3s ease-in-out",
        "slide-right": "slide-right 0.3s ease-in-out",
        "back-1": "back-1 20s infinite",
        "back-2": "back-2 20s infinite",
        "back-3": "back-3 20s infinite",
        "back-4": "back-4 20s infinite",
        "item-loading": "item-loading 3s infinite",
      },
    },
  },
  plugins: [customElements],
};
export default config;
