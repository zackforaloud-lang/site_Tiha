/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3EFE6',
        line: '#D8D3C8',
        sage: '#DCE2D0',
        taiga: {
          deep: '#182820',
          DEFAULT: '#243A30',
          light: '#2F4A3D',
        },
        moss: {
          DEFAULT: '#78816A',
          light: '#8E967C',
          dark: '#5C6550',
        },
        linen: {
          DEFAULT: '#E8E2D5',
          light: '#F3EFE6',
          dark: '#D8D1C0',
        },
        earth: {
          DEFAULT: '#76644F',
          light: '#8C7965',
        },
        ink: '#292D27',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.2em',
        wide: '0.08em',
      },
      maxWidth: {
        page: '1320px',
      },
      animation: {
        'slow-zoom': 'slowZoom 18s ease-in-out infinite alternate',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
};
