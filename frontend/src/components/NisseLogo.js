// ============================================
// NisseLogo — Premium minimalist inline SVG logo
// Variants: icon, full, horizontal
// Animated stars with Framer Motion
// ============================================

'use client';

import { motion } from 'framer-motion';

export function NisseLogo({ variant = 'icon', size = 48, className = '', animated = true }) {
  if (variant === 'full') {
    return <NisseFullLogo size={size} className={className} animated={animated} />;
  }
  if (variant === 'horizontal') {
    return <NisseHorizontalLogo size={size} className={className} animated={animated} />;
  }
  return <NisseIconLogo size={size} className={className} animated={animated} />;
}

// ─── Shared star paths (reusable across variants) ───

const STAR_CENTER = 'M 100 37 C 102 43, 106 47, 114 51 C 106 55, 102 59, 100 65 C 98 59, 94 55, 86 51 C 94 47, 98 43, 100 37 Z';
const STAR_LEFT = 'M 66 37 C 66.6 40, 68.2 41.4, 70.5 42 C 68.2 42.6, 66.6 44, 66 47 C 65.4 44, 63.8 42.6, 61.5 42 C 63.8 41.4, 65.4 40, 66 37 Z';
const STAR_RIGHT = 'M 136 48 C 136.4 50.5, 137.8 51.9, 140 52.5 C 137.8 53.1, 136.4 54.5, 136 57 C 135.6 54.5, 134.2 53.1, 132 52.5 C 134.2 51.9, 135.6 50.5, 136 48 Z';
const DOME = 'M 42 155 C 42 100, 68 78, 100 75 C 132 78, 158 100, 158 155';
const PLATE = 'M 34 155 Q 100 163, 166 155';

// ─── Animation configs ───

const floatCenter = {
  y: [0, -3, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
};

const floatLeft = {
  y: [0, -2.5, 0],
  transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
};

const floatRight = {
  y: [0, -2, 0],
  transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
};

const pulseCenter = {
  opacity: [1, 0.8, 1],
  transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
};

// ─── Icon variant (square, icon only) ───

function NisseIconLogo({ size, className, animated }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="Nisse logo"
    >
      <defs>
        <radialGradient id="nisse-sg" cx="50%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="nisse-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Subtle radial glow behind stars */}
      <circle cx="100" cy="48" r="36" fill="url(#nisse-sg)" />

      {/* Stars constellation */}
      <g filter="url(#nisse-glow)">
        {animated ? (
          <>
            <motion.path d={STAR_CENTER} fill="#FF6B35" animate={{ ...floatCenter, ...pulseCenter }} />
            <motion.path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" animate={floatLeft} />
            <motion.path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" animate={floatRight} />
          </>
        ) : (
          <>
            <path d={STAR_CENTER} fill="#FF6B35" />
            <path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" />
            <path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" />
          </>
        )}
      </g>

      {/* Cloche dome — thin, clean arc */}
      <path d={DOME} fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />

      {/* Base plate — subtle curve with rounded ends */}
      <path d={PLATE} fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Full variant (icon + wordmark, stacked) ───

function NisseFullLogo({ size, className, animated }) {
  const height = size * (260 / 320);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 260"
      width={size}
      height={height}
      className={className}
      aria-label="Nisse — AI Cooking Assistant"
    >
      <defs>
        <radialGradient id="nisse-sg-f" cx="50%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="nisse-glow-f">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Icon (centered at top) */}
      <g transform="translate(60, -10)">
        <circle cx="100" cy="48" r="36" fill="url(#nisse-sg-f)" />

        <g filter="url(#nisse-glow-f)">
          {animated ? (
            <>
              <motion.path d={STAR_CENTER} fill="#FF6B35" animate={{ ...floatCenter, ...pulseCenter }} />
              <motion.path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" animate={floatLeft} />
              <motion.path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" animate={floatRight} />
            </>
          ) : (
            <>
              <path d={STAR_CENTER} fill="#FF6B35" />
              <path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" />
              <path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" />
            </>
          )}
        </g>

        <path d={DOME} fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />
        <path d={PLATE} fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Wordmark */}
      <text
        x="160" y="210"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
        fontWeight="500"
        fontSize="48"
        letterSpacing="8"
        fill="#5A7D6C"
      >
        NISSE
      </text>

      {/* Tagline */}
      <text
        x="160" y="236"
        textAnchor="middle"
        fontFamily="-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif"
        fontWeight="400"
        fontSize="11"
        letterSpacing="4"
        fill="#5A7D6C"
        opacity="0.45"
      >
        AI COOKING ASSISTANT
      </text>
    </svg>
  );
}

// ─── Horizontal variant (icon + wordmark side by side) ───

function NisseHorizontalLogo({ size, className, animated }) {
  const height = size * (100 / 360);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 100"
      width={size}
      height={height}
      className={className}
      aria-label="Nisse — AI Cooking Assistant"
    >
      <defs>
        <radialGradient id="nisse-sg-h" cx="50%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="nisse-glow-h">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Icon (scaled to fit left side) */}
      <g transform="translate(5, 2) scale(0.48)">
        <circle cx="100" cy="48" r="36" fill="url(#nisse-sg-h)" />

        <g filter="url(#nisse-glow-h)">
          {animated ? (
            <>
              <motion.path d={STAR_CENTER} fill="#FF6B35" animate={{ ...floatCenter, ...pulseCenter }} />
              <motion.path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" animate={floatLeft} />
              <motion.path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" animate={floatRight} />
            </>
          ) : (
            <>
              <path d={STAR_CENTER} fill="#FF6B35" />
              <path d={STAR_LEFT} fill="#FF6B35" opacity="0.7" />
              <path d={STAR_RIGHT} fill="#FF6B35" opacity="0.5" />
            </>
          )}
        </g>

        <path d={DOME} fill="none" stroke="#5A7D6C" strokeWidth="3.5" strokeLinecap="round" />
        <path d={PLATE} fill="none" stroke="#5A7D6C" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Wordmark */}
      <text
        x="130" y="56"
        fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
        fontWeight="500"
        fontSize="42"
        letterSpacing="7"
        fill="#5A7D6C"
      >
        NISSE
      </text>

      {/* Tagline */}
      <text
        x="131" y="76"
        fontFamily="-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif"
        fontWeight="400"
        fontSize="10"
        letterSpacing="3.5"
        fill="#5A7D6C"
        opacity="0.45"
      >
        AI COOKING ASSISTANT
      </text>
    </svg>
  );
}
