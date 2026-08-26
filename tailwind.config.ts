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
        line: '#E7E4DF',
        'line-soft': '#F1EFEB',
      },
    },
  },
  plugins: [],
};
export default config;
