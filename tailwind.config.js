/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        surface: '#181c27',
        surface2: '#1e2235',
        accent: '#63d2a8',
        accent2: '#f5c542',
        'accent-red': '#ff6b6b',
        text: '#e8eaf0',
        'text-muted': '#6b7280',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}
