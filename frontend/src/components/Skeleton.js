// ============================================
// Skeleton — Shimmer loading placeholder (design system)
// ============================================

'use client';

export function Skeleton({ className = '', width, height, rounded = 'xl' }) {
  return (
    <div
      className={`skeleton rounded-${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3.5 rounded-full"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      <Skeleton className="w-full h-40" />
      <Skeleton className="w-3/4 h-4" rounded="full" />
      <Skeleton className="w-1/2 h-3" rounded="full" />
    </div>
  );
}
