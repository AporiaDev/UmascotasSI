/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/main/resources/react/**/*.{js,jsx,ts,tsx}",
    "./src/main/resources/templates/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        'umascota': {
          '50': '#F0FDF4',
          '100': '#DCFCE7',
          '200': '#BBF7D0',
          '300': '#86EFAC',
          '400': '#4ADE80',
          '500': '#22C55E',
          '600': '#16A34A',
          '700': '#15803D',
          '800': '#166534',
          '900': '#14532D',
          '950': '#052E16',
          'primary': '#4ADE80',
          'dark': '#22C55E',
          'light': '#86EFAC',
          'lighter': '#D1FAE5',
          'darkest': '#16A34A',
          'neon': '#39FF14',
          'mint': '#A8E6CF',
          'forest': '#228B22',
          'emerald': '#10B981',
          'teal': '#14B8A6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

