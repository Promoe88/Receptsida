// ============================================
// NisseButton — Pill-shaped, high-contrast button
// Bold text, sage green primary, soft shadow
// ============================================

'use client';

import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-sage-400 text-white hover:bg-sage-500 shadow-sage-glow',
  secondary: 'bg-terra-400 text-white hover:bg-terra-500 shadow-terra-glow',
  dark: 'bg-warm-900 text-white hover:bg-black shadow-medium',
  black: 'text-white shadow-medium hover:opacity-90',
  outline: 'bg-white text-warm-700 border border-warm-200 hover:border-sage-300 hover:bg-sage-50 shadow-soft',
  ghost: 'text-warm-600 hover:bg-warm-100 hover:text-warm-800',
};

const SIZES = {
  sm: 'px-5 py-2.5 text-xs gap-1.5',
  md: 'px-7 py-3.5 text-sm gap-2',
  lg: 'px-9 py-4 text-base gap-2.5',
};

export function NisseButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        transition-colors duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={variant === 'black' ? { backgroundColor: '#111111' } : undefined}
      {...props}
    >
      {children}
    </motion.button>
  );
}
