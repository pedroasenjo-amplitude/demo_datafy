/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0a0a0b',
          raised: '#141416',
          hover: '#1e1e21',
        },
        accent: {
          DEFAULT: '#1ed787',
          hover: '#3aeba0',
        },
      },
    },
  },
  plugins: [],
};
