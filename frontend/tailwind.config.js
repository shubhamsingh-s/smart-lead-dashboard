/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
