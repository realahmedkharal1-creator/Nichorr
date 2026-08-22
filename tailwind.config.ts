import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#F5F5F7",
          dark: "#121214",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        border: {
          subtle: "var(--border-subtle)",
          medium: "var(--border-medium)",
          strong: "var(--border-strong)",
        },
        slate: {
          850: "#1e293b",
          950: "#020617",
        },
        apple: {
          blue: "#0071E3",
          midnight: "#1D1D1F",
          gray: "#F5F5F7",
          border: "#E5E5EA",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#0071E3",
          600: "#0071E3",
          700: "#005bb5",
          800: "#00478f",
          900: "#003366",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          500: "#34C759",
          600: "#28CD41",
          700: "#248A3D",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          500: "#FF9500",
          600: "#D97706",
          700: "#B45309",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          500: "#FF3B30",
          600: "#E02D24",
          700: "#BE123C",
        },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 12px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        "elevated": "0 20px 40px -12px rgba(0, 0, 0, 0.12)",
        "ambient": "0 2px 14px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        "dropdown": "0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
