/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FCEEE8',
          100: '#F9D5C7',
          200: '#F0A98A',
          300: '#E57D50',
          400: '#D4572A',
          500: '#B8451F',
          600: '#953618',
          700: '#712912',
          800: '#4D1B0C',
          900: '#2A0E06',
        },
        warm: {
          50: '#FAF7F2',
          100: '#F3EDE4',
          200: '#E5DDD0',
          300: '#D4C8B5',
          400: '#B8A890',
          500: '#8A7D6B',
          600: '#6B604F',
          700: '#4D4538',
          800: '#2C2417',
          900: '#1A150D',
        },
        forest: {
          50: '#E8F2EB',
          100: '#C5DFC9',
          200: '#9DCBA5',
          300: '#74B680',
          400: '#4A7C59',
          500: '#3A6247',
          600: '#2B4935',
          700: '#1C3124',
          800: '#0E1812',
        },
        gold: {
          50: '#FFF8E7',
          100: '#FFEFC0',
          200: '#FFE299',
          300: '#E5C15B',
          400: '#C4982B',
          500: '#A37D1D',
          600: '#826214',
          700: '#61490E',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 2px 20px rgba(44,36,23,0.05)',
        medium: '0 4px 30px rgba(44,36,23,0.08)',
        strong: '0 8px 40px rgba(44,36,23,0.1)',
        glow: '0 0 0 4px rgba(212,87,42,0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
