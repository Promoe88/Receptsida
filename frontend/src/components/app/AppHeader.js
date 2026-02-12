// ============================================
// AppHeader — Slim native-style header
// ============================================

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function AppHeader({ title, showBack = false, rightAction }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-xl safe-top">
      <div className="flex items-center justify-between h-11 px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-sage-500 active:bg-sage-50 rounded-xl
                       transition-colors duration-150"
            >
              <ChevronLeft size={26} />
            </button>
          )}
        </div>
        <h1 className="font-semibold text-warm-800 text-[15px] truncate max-w-[60vw]">
          {title}
        </h1>
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
