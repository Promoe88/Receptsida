// ============================================
// NisseButton — Pill-shaped, high-contrast button
// Bold text, teal primary, black CTA
// ============================================

'use client';

import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-warm-800 text-white hover:bg-warm-900 shadow-btn hover:shadow-btn-hover',
  teal: 'bg-sage-400 text-white hover:bg-sage-500 shadow-teal-glow',
  secondary: 'bg-terra-400 text-white hover:bg-terra-500 shadow-terra-glow',
  outline: 'bg-white text-warm-700 border border-warm-200 hover:border-sage-300 hover:bg-sage-50 shadow-soft',
  ghost: 'text-sage-500 hover:bg-sage-50 hover:text-sage-600',
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
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={undefined}
      {...props}
    >
      {children}
    </motion.button>
  );
}
