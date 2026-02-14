// ============================================
// AppShell — Native app layout wrapper
// Splash screen → Bottom tab bar + content area
// OnboardingGate enforces: Tutorial → Login → App
// Fixed viewport — nothing goes under Dynamic Island
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomTabBar } from './BottomTabBar';
import { OnboardingGate } from './OnboardingGate';
import { NisseLogo } from '../NisseLogo';

// Routes where tab bar is hidden (auth flows, onboarding)
const HIDE_TABS = ['/login', '/register', '/tutorial', '/verify', '/forgot-password', '/reset-password'];

// Routes that should be completely fixed (no scroll at all)
const FIXED_VIEWS = ['/login', '/register', '/tutorial', '/verify', '/forgot-password', '/reset-password'];

export function AppShell({ children }) {
  const pathname = usePathname();
  const showTabs = !HIDE_TABS.some((r) => pathname.startsWith(r));
  const isFixed = FIXED_VIEWS.some((r) => pathname.startsWith(r));
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-shell app-viewport">
      {/* ═══ SPLASH SCREEN ═══ */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: '#F5F5F7' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <NisseLogo variant="full" size={180} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ APP CONTENT ═══ */}
      <OnboardingGate>
        <main className={`app-main ${isFixed ? 'app-main--fixed' : 'app-main--scroll'}`}>
          {children}
        </main>
        {showTabs && <BottomTabBar />}
      </OnboardingGate>
    </div>
  );
}
