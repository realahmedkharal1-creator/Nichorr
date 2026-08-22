import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
          950: '#020617',
        },
        apple: {
          blue: '#0071E3',
          midnight: '#1D1D1F',
          gray: '#F5F5F7',
          border: '#E5E5EA',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
        },
        indigo: {
          500: '#0071E3',
          600: '#0071E3',
        },
        emerald: {
          500: '#34C759',
          600: '#28CD41',
        },
        amber: {
          500: '#FF9500',
        },
        rose: {
          500: '#FF3B30',
        },
        surface: '#FFFFFF',
        bento: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
export default config;
