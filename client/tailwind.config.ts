import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './emblem.png'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
