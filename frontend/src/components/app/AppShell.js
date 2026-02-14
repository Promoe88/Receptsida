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
            style={{ background: '#EBEDF0' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <svg width="120" height="96" viewBox="0 0 200 160" fill="none" aria-label="Nisse" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="splash-sg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D97757" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#D97757" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="52" r="18" fill="url(#splash-sg)" />
                <path
                  d="M 40 130 C 40 130, 40 62, 100 50 C 160 62, 160 130, 160 130"
                  fill="none" stroke="#5A7D6C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                />
                <line x1="32" y1="130" x2="168" y2="130" stroke="#5A7D6C" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 38 138 Q 100 146, 162 138" fill="none" stroke="#5A7D6C" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
                <path d="M 100 30 C 101.5 36, 104 38.5, 110 40 C 104 41.5, 101.5 44, 100 50 C 98.5 44, 96 41.5, 90 40 C 96 38.5, 98.5 36, 100 30 Z" fill="#D97757" />
                <path d="M 124 46 C 124.6 48, 126 49.4, 128 50 C 126 50.6, 124.6 52, 124 54 C 123.4 52, 122 50.6, 120 50 C 122 49.4, 123.4 48, 124 46 Z" fill="#D97757" opacity="0.55" />
              </svg>
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
