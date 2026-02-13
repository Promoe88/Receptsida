// ============================================
// NisseButton — Design system §6.1
// Primary: black pill, disabled 0.4, hover opacity 0.9
// Ghost: text #2ABFBF, hover bg #E8F8F8
// All: 44px min touch target
// ============================================

'use client';

import { motion } from 'framer-motion';

const VARIANTS = {
  primary: {
    className: 'bg-warm-800 text-white',
    style: { boxShadow: '0 4px 12px rgba(26,26,46,0.15)' },
  },
  teal: {
    className: 'bg-sage-400 text-white hover:bg-sage-500 shadow-teal-glow',
    style: {},
  },
  secondary: {
    className: 'bg-terra-400 text-white hover:bg-terra-500 shadow-terra-glow',
    style: {},
  },
  outline: {
    className: 'bg-white text-warm-800',
    style: { border: '1px solid #E5E5EA' },
  },
  ghost: {
    className: '',
    style: { color: '#2ABFBF' },
  },
};

const SIZES = {
  sm: 'px-5 py-2.5 text-caption gap-1.5',
  md: 'px-7 py-3.5 text-label gap-2',
  lg: 'px-9 py-4 text-body gap-2.5',
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
  const v = VARIANTS[variant] || VARIANTS.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      whileHover={variant === 'primary' ? { opacity: 0.9 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${v.className}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{ minHeight: '44px', ...v.style }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
