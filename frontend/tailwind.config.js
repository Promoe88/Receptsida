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
        // Teal — primary accent (#2ABFBF)
        sage: {
          50: '#E8F8F8',
          100: '#C8EEEE',
          200: '#8DE1E1',
          300: '#55D2D2',
          400: '#2ABFBF',
          DEFAULT: '#2ABFBF',
          500: '#22A8A8',
          600: '#1B8C8C',
          700: '#146B6B',
          800: '#0E4D4D',
          900: '#083333',
        },
        // Warm Orange — secondary accent (#FF7A50)
        terra: {
          50: '#FFF0EB',
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
          muted: '#C7C7CC',
        },
        // Gold — stars, premium, inspiration
        gold: {
          DEFAULT: '#FFD60A',
          light: '#FFF9E0',
        },
        // Semantic colors
        success: {
          DEFAULT: '#34C759',
          50: '#EAFBEF',
          500: '#34C759',
          600: '#28A745',
        },
        danger: {
          DEFAULT: '#FF3B30',
          50: '#FFF0EF',
          500: '#FF3B30',
          600: '#E0342B',
        },
        warning: {
          DEFAULT: '#FF9500',
          50: '#FFF6E6',
          500: '#FF9500',
        },
        info: {
          DEFAULT: '#007AFF',
          50: '#EBF3FF',
          500: '#007AFF',
        },
      },
      fontFamily: {
        display: ['"SF Pro Display"', 'Inter', '-apple-system', 'sans-serif'],
        body: ['"SF Pro Display"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        // Design system typography scale
        'hero':    ['32px', { lineHeight: '1.15', letterSpacing: '-0.5px', fontWeight: '700' }],
        'title':   ['24px', { lineHeight: '1.2', letterSpacing: '-0.3px', fontWeight: '700' }],
        'heading': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body':    ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label':   ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '500' }],
        'tiny':    ['10px', { lineHeight: '1.3', letterSpacing: '1px', fontWeight: '600' }],
        // Keep responsive display sizes for web hero sections
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      boxShadow: {
        // Design system shadow scale
        sm: '0 1px 3px rgba(0,0,0,0.04)',
        md: '0 2px 12px rgba(0,0,0,0.06)',
        lg: '0 8px 30px rgba(0,0,0,0.08)',
        glow: '0 0 0 4px rgba(42,191,191,0.15)',
        btn: '0 4px 12px rgba(26,26,46,0.15)',
        // Extended shadows
        soft: '0 1px 3px rgba(0,0,0,0.04)',
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.08)',
        'card-deep': '0 8px 24px rgba(0,0,0,0.06), 0 24px 60px rgba(0,0,0,0.12)',
        medium: '0 8px 32px rgba(0,0,0,0.06)',
        elevated: '0 8px 30px rgba(0,0,0,0.08)',
        strong: '0 20px 60px rgba(0,0,0,0.10)',
        glass: '0 4px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        'btn-hover': '0 6px 20px rgba(26,26,46,0.20)',
        'teal-glow': '0 4px 24px rgba(42,191,191,0.25)',
        'terra-glow': '0 4px 24px rgba(255,122,80,0.25)',
        'float': '0 8px 40px rgba(0,0,0,0.12)',
        'nav': '0 -4px 20px rgba(0,0,0,0.04)',
      },
      spacing: {
        // Design system spacing (8px base)
        'xs': '4px',
        'sm-space': '8px',
        'md-space': '16px',
        'lg-space': '24px',
        'xl-space': '32px',
        '2xl-space': '48px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'ticker': 'ticker 20s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'heart-pop': 'heartPop 0.4s cubic-bezier(0.22,1,0.36,1)',
        'check-draw': 'checkDraw 0.5s ease forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'toast-in': 'toastIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'toast-out': 'toastOut 0.2s ease-in forwards',
        'spin-fast': 'spin 0.8s ease-in-out infinite',
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
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        checkDraw: {
          from: { 'stroke-dashoffset': '24' },
          to: { 'stroke-dashoffset': '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(-12px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(-12px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};
