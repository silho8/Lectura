/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base-100': '#1A1A1A', // Very dark gray, almost black
        'base-200': '#2C2C2C', // Dark gray
        'base-300': '#444444', // Medium-dark gray
        'primary': '#00FFFF', // Bright Cyan/Aqua
        'secondary': '#FF00FF', // Bright Magenta/Fuchsia
        'accent': '#FFFF00', // Bright Yellow
        'text-light': '#E0E0E0', // Light gray for body text
        'text-dark': '#1A1A1A', // For use on light backgrounds
        'success': '#00FF00', // Bright Green
        'error': '#FF0000',   // Bright Red
      },
      fontFamily: {
        pixel: ['"Pixelify Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'pixel-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'pixel-md': '6px 6px 0px 0px rgba(0,0,0,1)',
        'pixel-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'pixel-sm-primary': '4px 4px 0px 0px #00FFFF',
        'pixel-sm-secondary': '4px 4px 0px 0px #FF00FF',
        'pixel-sm-accent': '4px 4px 0px 0px #FFFF00',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 2px 0px #00FFFF', opacity: '0.8' },
          '50%': { boxShadow: '0 0 8px 2px #00FFFF', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}