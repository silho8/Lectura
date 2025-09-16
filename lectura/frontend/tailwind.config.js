/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Based on the UI mockups provided
      colors: {
        'brand-blue': {
          DEFAULT: '#0D6EFD', // A prominent blue from the buttons
          dark: '#0A58CA',
        },
        'brand-gray': {
          light: '#F8F9FA',
          DEFAULT: '#6C757D',
          dark: '#343A40',
        },
        'brand-background': '#F0F2F5', // Light gray background
      },
      fontFamily: {
        // Using Inter as a default modern, clean font
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
