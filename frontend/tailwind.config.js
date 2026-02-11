/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core dark surfaces
        void: {
          DEFAULT: '#050505',
          50: '#1A1A1A',
          100: '#141414',
          200: '#121212',
          300: '#0E0E0E',
          400: '#0A0A0A',
          500: '#050505',
        },
        surface: {
          DEFAULT: '#121212',
          50: '#2A2A2A',
          100: '#222222',
          200: '#1C1C1C',
          300: '#181818',
          400: '#141414',
          500: '#121212',
        },
        // Electric accent
        accent: {
          50: '#FFF1EB',
          100: '#FFD9C7',
          200: '#FFB08A',
          300: '#FF8C52',
          400: '#FF5C00',
          DEFAULT: '#FF5C00',
          500: '#E65200',
          600: '#BF4400',
          700: '#993600',
          800: '#732800',
          900: '#4D1B00',
        },
        // Text hierarchy
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        // Status
        emerald: { 400: '#34D399', 500: '#10B981', 600: '#059669' },
        red: { 400: '#F87171', 500: '#EF4444' },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,92,0,0.15), 0 0 60px rgba(255,92,0,0.05)',
        'glow-sm': '0 0 10px rgba(255,92,0,0.12)',
        'glow-ring': '0 0 0 2px rgba(255,92,0,0.3)',
        soft: '0 2px 16px rgba(0,0,0,0.25)',
        medium: '0 8px 32px rgba(0,0,0,0.35)',
        strong: '0 16px 64px rgba(0,0,0,0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sparkline': 'sparkline 1.5s ease forwards',
        'scan': 'scan 3s linear infinite',
        'border-pulse': 'borderPulse 2s ease-in-out infinite',
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,92,0,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(255,92,0,0.2), 0 0 80px rgba(255,92,0,0.05)' },
        },
        sparkline: {
          from: { 'stroke-dashoffset': '100' },
          to: { 'stroke-dashoffset': '0' },
        },
        scan: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(255,92,0,0.15)' },
          '50%': { borderColor: 'rgba(255,92,0,0.35)' },
        },
      },
    },
  },
  plugins: [],
};
