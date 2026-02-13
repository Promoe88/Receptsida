// ============================================
// Spinner — Design system §8.1
// Circular, 2px stroke, teal (#2ABFBF)
// Sizes: 16px (inline/buttons), 24px (cards), 40px (full-page)
// Animation: 800ms rotate
// ============================================

'use client';

const SIZES = {
  sm: 16,
  md: 24,
  lg: 40,
};

export function Spinner({ size = 'md', className = '' }) {
  const px = SIZES[size] || SIZES.md;

  return (
    <svg
      className={`animate-spin-fast ${className}`}
      style={{ width: px, height: px, color: '#2ABFBF' }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
