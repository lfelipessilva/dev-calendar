import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#797596ff',
        'dun': '#d1c6adff',
        'khaki': '#bbada0ff',
        'secondary': '#a1869eff',
        'tertiary': '#0b1d51ff',
      }
    },
  },
  plugins: [],
} satisfies Config;