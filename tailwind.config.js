/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          light: '#93c5fd'
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#6ee7b7'
        }
      },
      animation: {
        'dice-roll': 'diceRoll 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '20%': { transform: 'rotateX(360deg) rotateY(180deg)' },
          '40%': { transform: 'rotateX(720deg) rotateY(360deg)' },
          '60%': { transform: 'rotateX(1080deg) rotateY(540deg)' },
          '80%': { transform: 'rotateX(1440deg) rotateY(720deg)' },
          '100%': { transform: 'rotateX(1800deg) rotateY(900deg)' }
        }
      }
    },
  },
  plugins: [],
}