import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brown-red": "#9b4100",
        "bright-orange": "#ff7300",
        "dark-red": "#a50000",
        "primary-blue": "#1E40AF",
        "primary-purple": "#7C3AED",
      },
      animation: {
        slideInFromLeft: "slideInFromLeft 1.5s ease-out",
        slideInFromRight: "slideInFromRight 1.5s ease-out",
      },
      keyframes: {
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mylight: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-content": "#222222",
        },
      },
      {
        mydark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-content": "#ffffff",
        },
      },
      "cupcake",
      "black",
    ],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
