/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        f1: '#e10600',
        motogp: '#0066cc',
        lemans: '#ff8c00',
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
      },
      fontFamily: {
        'racing': ['Orbitron', 'monospace'],
      }
    },
  },
  plugins: [],
} 