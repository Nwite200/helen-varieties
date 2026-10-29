/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Poppins for body text, Rajdhani for headings (defined in src/index.css)
        sans: ['var(--font-body)'],
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },
      colors: {
        brand: {
          blue: {
            DEFAULT: '#0070DC',
            light: '#E6F0FA',
            dark: '#005BB5',
          },
          primary: '#C90016',
          burgundy: '#78000C',
          dark: '#191919',
          soft: '#F7F7F8',
        }
      }
    },
  },
  plugins: [],
}

