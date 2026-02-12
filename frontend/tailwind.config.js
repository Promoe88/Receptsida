/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Cream background
        cream: {
          DEFAULT: '#FDFBF7',
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F7F3EC',
          300: '#F0EBE3',
          400: '#E8E2D8',
          500: '#DED6CA',
        },
        // Sage green — primary (#5A7D6C)
        sage: {
          50: '#EFF5F2',
          100: '#DFEAE4',
          200: '#BFD5C9',
          300: '#9FBFAE',
          400: '#5A7D6C',
          DEFAULT: '#5A7D6C',
          500: '#4A6A5A',
          600: '#3D5849',
          700: '#304539',
          800: '#23332A',
          900: '#17211B',
        },
        // Warm Clay — secondary (#D97757)
        terra: {
          50: '#FDF4F0',
          100: '#F9E5DC',
          200: '#F0C7B5',
          300: '#E49A7E',
          400: '#D97757',
          DEFAULT: '#D97757',
          500: '#C4623F',
          600: '#A34F32',
          700: '#7E3D27',
          800: '#5A2C1C',
          900: '#381C12',
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
        body: ['Inter', 'system-ui', 'sans-serif'],
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
        'sage-glow': '0 0 20px rgba(90,125,108,0.15)',
        'terra-glow': '0 0 20px rgba(217,119,87,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'ticker': 'ticker 20s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
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
        sparkle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
