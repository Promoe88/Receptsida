// ============================================
// NisseLoader — Design system §8.1
// Uses the Spinner component (single loader pattern)
// Full-page: centered 40px spinner + text
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Spinner } from './Spinner';

export function NisseLoader({ size = 'lg', className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner size={size} />
    </div>
  );
}

export function NisseFullPageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4"
         style={{ background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(12px)' }}>
      <Spinner size="lg" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-label text-warm-500 font-medium"
      >
        Laddar...
      </motion.p>
    </div>
  );
}
