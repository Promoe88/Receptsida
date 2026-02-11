/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm Scandinavian palette
        cream: {
          DEFAULT: '#FDFBF7',
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F7F3EC',
          300: '#F0EBE3',
          400: '#E8E2D8',
          500: '#DED6CA',
        },
        // Sage green — primary
        sage: {
          50: '#F0F5F1',
          100: '#E0EBE2',
          200: '#C2D7C5',
          300: '#A3C3A9',
          400: '#7C9A82',
          DEFAULT: '#7C9A82',
          500: '#5E8266',
          600: '#4A6B51',
          700: '#3A5440',
          800: '#2B3D30',
          900: '#1B2720',
        },
        // Terracotta — secondary accent
        terra: {
          50: '#FDF5F0',
          100: '#F5E6DD',
          200: '#EAC9B5',
          300: '#D4916F',
          400: '#C4704B',
          DEFAULT: '#C4704B',
          500: '#A85A38',
          600: '#8C4A2F',
          700: '#6E3A25',
          800: '#512B1C',
          900: '#351C12',
        },
        // Warm neutrals for text
        warm: {
          50: '#FDFBF7',
          100: '#F5F1EB',
          200: '#E8E4DF',
          300: '#D4CFC8',
          400: '#B5AFA7',
          500: '#9B9590',
          600: '#6B6560',
          700: '#4A4540',
          800: '#2D2A26',
          900: '#1A1816',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-md': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '400' }],
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '400' }],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(45,42,38,0.06)',
        card: '0 2px 16px rgba(45,42,38,0.06), 0 0 0 1px rgba(45,42,38,0.03)',
        medium: '0 4px 24px rgba(45,42,38,0.08)',
        elevated: '0 8px 40px rgba(45,42,38,0.10)',
        strong: '0 12px 48px rgba(45,42,38,0.14)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'sage-glow': '0 0 20px rgba(124,154,130,0.15)',
        'terra-glow': '0 0 20px rgba(196,112,75,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'ticker': 'ticker 20s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
