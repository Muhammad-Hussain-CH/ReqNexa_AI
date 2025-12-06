import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1976D2",
        secondary: "#388E3C",
        accent: "#F57C00",
      },
    },
  },
  plugins: [],
} satisfies Config;
