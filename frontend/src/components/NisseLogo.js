// ============================================
// NisseLogo — Inline SVG logo component
// Variants: icon, full, horizontal
// ============================================

'use client';

export function NisseLogo({ variant = 'icon', size = 48, className = '' }) {
  if (variant === 'full') {
    return <NisseFullLogo size={size} className={className} />;
  }
  if (variant === 'horizontal') {
    return <NisseHorizontalLogo size={size} className={className} />;
  }
  return <NisseIconLogo size={size} className={className} />;
}

function NisseIconLogo({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 160"
      width={size}
      height={size * 0.8}
      className={className}
      aria-label="Nisse logo"
    >
      <defs>
        <radialGradient id="nisse-sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D97757" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D97757" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sparkle glow */}
      <circle cx="100" cy="52" r="18" fill="url(#nisse-sg)" />

      {/* Cloche dome */}
      <path
        d="M 40 130 C 40 130, 40 62, 100 50 C 160 62, 160 130, 160 130"
        fill="none"
        stroke="#5A7D6C"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base plate */}
      <line x1="32" y1="130" x2="168" y2="130" stroke="#5A7D6C" strokeWidth="5.5" strokeLinecap="round" />

      {/* Plate lip */}
      <path
        d="M 38 138 Q 100 146, 162 138"
        fill="none"
        stroke="#5A7D6C"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* 4-pointed AI sparkle */}
      <path
        d="M 100 30 C 101.5 36, 104 38.5, 110 40 C 104 41.5, 101.5 44, 100 50 C 98.5 44, 96 41.5, 90 40 C 96 38.5, 98.5 36, 100 30 Z"
        fill="#D97757"
      />

      {/* Secondary sparkle */}
      <path
        d="M 124 46 C 124.6 48, 126 49.4, 128 50 C 126 50.6, 124.6 52, 124 54 C 123.4 52, 122 50.6, 120 50 C 122 49.4, 123.4 48, 124 46 Z"
        fill="#D97757"
        opacity="0.55"
      />
    </svg>
  );
}

function NisseFullLogo({ size, className }) {
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
        <radialGradient id="nisse-sg-f" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D97757" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D97757" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Icon */}
      <g transform="translate(60, 10)">
        <circle cx="100" cy="52" r="18" fill="url(#nisse-sg-f)" />
        <path
          d="M 40 130 C 40 130, 40 62, 100 50 C 160 62, 160 130, 160 130"
          fill="none" stroke="#5A7D6C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <line x1="32" y1="130" x2="168" y2="130" stroke="#5A7D6C" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 38 138 Q 100 146, 162 138" fill="none" stroke="#5A7D6C" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
        <path d="M 100 30 C 101.5 36, 104 38.5, 110 40 C 104 41.5, 101.5 44, 100 50 C 98.5 44, 96 41.5, 90 40 C 96 38.5, 98.5 36, 100 30 Z" fill="#D97757" />
        <path d="M 124 46 C 124.6 48, 126 49.4, 128 50 C 126 50.6, 124.6 52, 124 54 C 123.4 52, 122 50.6, 120 50 C 122 49.4, 123.4 48, 124 46 Z" fill="#D97757" opacity="0.55" />
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

function NisseHorizontalLogo({ size, className }) {
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
        <radialGradient id="nisse-sg-h" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D97757" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D97757" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Icon (scaled) */}
      <g transform="translate(10, 6) scale(0.52)">
        <circle cx="100" cy="52" r="18" fill="url(#nisse-sg-h)" />
        <path
          d="M 40 130 C 40 130, 40 62, 100 50 C 160 62, 160 130, 160 130"
          fill="none" stroke="#5A7D6C" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <line x1="32" y1="130" x2="168" y2="130" stroke="#5A7D6C" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M 38 138 Q 100 146, 162 138" fill="none" stroke="#5A7D6C" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <path d="M 100 30 C 101.5 36, 104 38.5, 110 40 C 104 41.5, 101.5 44, 100 50 C 98.5 44, 96 41.5, 90 40 C 96 38.5, 98.5 36, 100 30 Z" fill="#D97757" />
        <path d="M 124 46 C 124.6 48, 126 49.4, 128 50 C 126 50.6, 124.6 52, 124 54 C 123.4 52, 122 50.6, 120 50 C 122 49.4, 123.4 48, 124 46 Z" fill="#D97757" opacity="0.55" />
      </g>

      {/* Wordmark */}
      <text
        x="130" y="58"
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
        x="131" y="78"
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
