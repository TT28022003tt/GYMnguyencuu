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
        "dark-red":"#a50000"
      },
    },
  },
  daisyui: {
    themes: [{
      mylight: {
        ...require("daisyui/src/theming/themes")["light"], // Kế thừa toàn bộ theme light
        "base-content": "#222222", // Màu chữ trên nền light
      },
    },
    {
      mydark: {
        ...require("daisyui/src/theming/themes")["dark"], // Kế thừa toàn bộ theme dark
        "base-content": "#ffffff", // Màu chữ TRẮNG trên nền dark
      },
    }, "cupcake","black"],
  },
  plugins: [
    require('daisyui')
  ],
} satisfies Config;
