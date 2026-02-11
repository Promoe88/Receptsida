// ============================================
// AuthProvider — Init auth on app mount
// ============================================

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';

export function AuthProvider({ children }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
