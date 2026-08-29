import type { Config } from "tailwindcss";

/**
 * All palette colors are driven by CSS custom properties defined in globals.css
 * (:root for light, .dark for dark). They are stored as space-separated RGB
 * channels so Tailwind's `/<alpha-value>` opacity modifiers keep working
 * (e.g. border-citation/20, bg-verified/10).
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--shadow-rgb) / 0.05), 0 4px 16px -4px rgb(var(--shadow-rgb) / 0.08)",
        "card-hover": "0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 12px 28px -6px rgb(var(--shadow-rgb) / 0.14)",
        pop: "0 8px 30px -6px rgb(var(--shadow-rgb) / 0.18)",
      },
      colors: {
        ink: withVar("--ink"),
        header: withVar("--header"),
        paper: withVar("--paper"),
        card: withVar("--card"),
        citation: withVar("--citation"),
        "citation-bg": withVar("--citation-bg"),
        verified: withVar("--verified"),
        "verified-bg": withVar("--verified-bg"),
        conflict: withVar("--conflict"),
        "conflict-bg": withVar("--conflict-bg"),
        warning: withVar("--warning"),
        "warning-bg": withVar("--warning-bg"),
        muted: withVar("--muted"),
        "muted-2": withVar("--muted-2"),
        line: withVar("--line"),
        "line-soft": withVar("--line-soft"),
      },
    },
  },
  plugins: [],
};
export default config;
