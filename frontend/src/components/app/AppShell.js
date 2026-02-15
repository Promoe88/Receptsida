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
              <svg width="120" height="120" viewBox="0 0 200 200" fill="none" aria-label="Nisse" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="splash-sg" cx="50%" cy="25%" r="30%">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                  </radialGradient>
                  <filter id="splash-glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Star glow */}
                <circle cx="100" cy="48" r="36" fill="url(#splash-sg)" />
                {/* Stars constellation */}
                <g filter="url(#splash-glow)">
                  <motion.path
                    d="M 100 37 C 102 43, 106 47, 114 51 C 106 55, 102 59, 100 65 C 98 59, 94 55, 86 51 C 94 47, 98 43, 100 37 Z"
                    fill="#FF6B35"
                    animate={{ y: [0, -3, 0], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M 66 37 C 66.6 40, 68.2 41.4, 70.5 42 C 68.2 42.6, 66.6 44, 66 47 C 65.4 44, 63.8 42.6, 61.5 42 C 63.8 41.4, 65.4 40, 66 37 Z"
                    fill="#FF6B35" opacity="0.7"
                    animate={{ y: [0, -2.5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  />
                  <motion.path
                    d="M 136 48 C 136.4 50.5, 137.8 51.9, 140 52.5 C 137.8 53.1, 136.4 54.5, 136 57 C 135.6 54.5, 134.2 53.1, 132 52.5 C 134.2 51.9, 135.6 50.5, 136 48 Z"
                    fill="#FF6B35" opacity="0.5"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  />
                </g>
                {/* Cloche dome */}
                <path d="M 42 155 C 42 100, 68 78, 100 75 C 132 78, 158 100, 158 155" fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />
                {/* Base plate */}
                <path d="M 34 155 Q 100 163, 166 155" fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" />
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
