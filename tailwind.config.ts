import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,23,23,0.04), 0 4px 16px -4px rgba(23,23,23,0.06)',
        'card-hover': '0 2px 4px rgba(23,23,23,0.05), 0 12px 28px -6px rgba(23,23,23,0.10)',
      },
      colors: {
        ink: '#121214',
        paper: '#FAF9F7',
        card: '#FFFFFF',
        citation: '#EF6351',
        'citation-bg': '#FDECE7',
        verified: '#1E8F6B',
        'verified-bg': '#E3F5EE',
        conflict: '#AF2A3C',
        'conflict-bg': '#FBE8EA',
        warning: '#B7791E',
        'warning-bg': '#FDF3E0',
        muted: '#6B6F76',
        'muted-2': '#9A9EA1',
        line: '#DAD5CB',
        'line-soft': '#E6E1D7',
      },
    },
  },
  plugins: [],
};
export default config;
