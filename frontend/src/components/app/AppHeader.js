// ============================================
// AppHeader — Glass-morphism sticky header
// ============================================

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function AppHeader({ title, showBack = false, rightAction }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-warm-200/30"
            style={{
              background: 'rgba(247, 247, 247, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
      <div className="flex items-center justify-between h-11 px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-sage-500 active:bg-sage-50 rounded-xl
                       transition-colors duration-150"
            >
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <h1 className="font-bold text-warm-800 text-[15px] truncate max-w-[60vw] tracking-tight">
          {title}
        </h1>
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
