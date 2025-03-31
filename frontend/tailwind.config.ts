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
    themes: ["light", "dark", "cupcake","black"],
  },
  plugins: [
    require('daisyui')
  ],
} satisfies Config;
