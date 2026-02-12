/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Background system
        cream: {
          DEFAULT: '#F5F5F7',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F2F2F2',
          300: '#EBEBEB',
          400: '#E0E0E0',
          500: '#D4D4D4',
        },
        // Sage green — primary accent (#7C9A6E)
        sage: {
          50: '#F2F7F0',
          100: '#E0ECDC',
          200: '#C2D9B9',
          300: '#9FC093',
          400: '#7C9A6E',
          DEFAULT: '#7C9A6E',
          500: '#658C55',
          600: '#507040',
          700: '#3D5630',
          800: '#2B3D22',
          900: '#1A2615',
        },
        // Warm Orange — secondary accent (#FF7A50)
        terra: {
          50: '#FFF3EE',
          100: '#FFE4D9',
          200: '#FFC5AE',
          300: '#FFA07D',
          400: '#FF7A50',
          DEFAULT: '#FF7A50',
          500: '#E8633A',
          600: '#C24D28',
          700: '#9A3B1E',
          800: '#722C16',
          900: '#4A1D0E',
        },
        // Neutral text scale (navy-anchored)
        warm: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#8E8E93',
          500: '#636366',
          600: '#48484A',
          700: '#2C2C2E',
          800: '#1A1A2E',
          900: '#0F0F1E',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      boxShadow: {
        soft: '0 2px 16px rgba(0,0,0,0.04)',
        card: '0 4px 40px rgba(0,0,0,0.05)',
        'card-deep': '0 8px 24px rgba(0,0,0,0.06), 0 24px 60px rgba(0,0,0,0.12)',
        medium: '0 8px 32px rgba(0,0,0,0.06)',
        elevated: '0 12px 48px rgba(0,0,0,0.08)',
        strong: '0 20px 60px rgba(0,0,0,0.10)',
        glass: '0 4px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        'sage-glow': '0 4px 24px rgba(124,154,110,0.25)',
        'terra-glow': '0 4px 24px rgba(255,122,80,0.25)',
        'float': '0 8px 40px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'ticker': 'ticker 20s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
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
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
