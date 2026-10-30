/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        commons: {
          primary: '#176B4A',
          dark: '#104B36',
          light: '#E7F2EC',
          bg: '#F3F4F3',
          card: '#FFFFFF',
          text: '#202B3C',
          muted: '#858D91',
          border: '#E8EBE9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'inner': '6px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 1px 2px 0 rgba(16, 75, 54, 0.03)',
      }
    },
  },
  plugins: [],
}
