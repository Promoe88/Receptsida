// ============================================
// PageTransition — iOS-style slide transitions
// Wraps route content with AnimatePresence
// ============================================

'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
