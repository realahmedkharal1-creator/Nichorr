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
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        ink: '#12161C',
        paper: '#F3F5F4',
        card: '#FFFFFF',
        citation: '#2C4A73',
        'citation-bg': '#E9EEF4',
        verified: '#1E7A5F',
        'verified-bg': '#E7F3EE',
        conflict: '#9C3B2E',
        'conflict-bg': '#F7E9E5',
        warning: '#96650E',
        'warning-bg': '#FBF0DD',
        muted: '#5C6167',
        'muted-2': '#8A8F96',
        line: '#DADDD8',
        'line-soft': '#E8EAE7',
      },
    },
  },
  plugins: [],
};
export default config;
