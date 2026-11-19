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
        background: '#060913',
        surface: {
          DEFAULT: '#0d1322',
          muted: '#141d34',
          border: '#1f2b48'
        },
        accent: {
          violet: '#8b5cf6',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
          coral: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
}
