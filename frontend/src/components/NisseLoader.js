// ============================================
// NisseLoader — Pulsing sparkle SVG loader
// Used for route changes and loading states
// ============================================

'use client';

import { motion } from 'framer-motion';

export function NisseLoader({ size = 48, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main sparkle */}
        <path
          d="M24 4L27.5 18.5L42 16L30 24L42 32L27.5 29.5L24 44L20.5 29.5L6 32L18 24L6 16L20.5 18.5L24 4Z"
          fill="#2ABFBF"
          fillOpacity="0.9"
        />
        {/* Inner glow */}
        <circle cx="24" cy="24" r="5" fill="#D97757" fillOpacity="0.6" />
      </motion.svg>
    </div>
  );
}

export function NisseFullPageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
      <NisseLoader size={56} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-warm-500 font-medium"
      >
        Laddar...
      </motion.p>
    </div>
  );
}
