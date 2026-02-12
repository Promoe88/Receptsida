// ============================================
// AuthProvider — Init auth + native plugins on mount
// ============================================

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { initNativePlugins } from '../lib/capacitor';

export function AuthProvider({ children }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
    initNativePlugins();
  }, [init]);

  return <>{children}</>;
}
