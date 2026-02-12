// ============================================
// NisseButton — Stadium-shaped button with scale-on-tap
// Reusable across all routes
// ============================================

'use client';

import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-sage-400 text-white hover:bg-sage-500 shadow-soft hover:shadow-medium',
  secondary: 'bg-terra-400 text-white hover:bg-terra-500 shadow-soft hover:shadow-medium',
  outline: 'bg-white text-warm-700 border border-warm-200 hover:border-sage-300 hover:bg-sage-50',
  ghost: 'text-warm-600 hover:bg-warm-100 hover:text-warm-800',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
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
        inline-flex items-center justify-center rounded-full font-semibold
        transition-colors duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
