/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          plum: '#753248',
          'plum-light': '#8F3D58',
          'plum-dark': '#5C2739',
        },
        ivory: '#FAF7F5',
        blush: '#F5EAEF',
        mauve: '#B98398',
        rose: '#D8A7B8',
        champagne: '#EADDD2',
        charcoal: '#1F1A1C',
        'warm-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
