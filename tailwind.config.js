/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'cherry-bomb': ['"Cherry Bomb One"', 'cursive'],
        'bebas-neue': ['"Bebas Neue"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      
      colors: {
        'primary': '#1a1a1a',
        'secondary': '#ff4500',
        'text': '#ffffff',
        'button-primary': '#ff4500',
        'button-secondary': '#333333',
      },
    },
  },
  plugins: [],
};
