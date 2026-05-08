/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ec',
          100: '#faf0cc',
          200: '#f5df95',
          300: '#f0ca5a',
          400: '#e8b530',
          500: '#D4A847',
          600: '#c49020',
          700: '#a3731a',
          800: '#855b1b',
          900: '#6e4b1b',
        },
        forest: {
          50:  '#edfaf4',
          100: '#d3f3e4',
          200: '#a9e6cb',
          300: '#73d2ac',
          400: '#3db88a',
          500: '#1a9970',
          600: '#0f7a5a',
          700: '#0d6249',
          800: '#0d4d3b',
          900: '#0c4032',
        },
        dark: {
          50:  '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#555555',
          600: '#333333',
          700: '#1e1e1e',
          800: '#141414',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
