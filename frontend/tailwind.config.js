/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Soft UI background system
        cream: {
          DEFAULT: '#F7F7F7',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F2F2F2',
          300: '#EBEBEB',
          400: '#E0E0E0',
          500: '#D4D4D4',
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
        // Warm Clay — accent (#D97757)
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
        // Neutral text scale
        warm: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
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
        medium: '0 8px 32px rgba(0,0,0,0.06)',
        elevated: '0 12px 48px rgba(0,0,0,0.08)',
        strong: '0 20px 60px rgba(0,0,0,0.10)',
        glass: '0 4px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        'sage-glow': '0 4px 24px rgba(90,125,108,0.20)',
        'terra-glow': '0 4px 24px rgba(217,119,87,0.20)',
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
