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
              className="flex flex-col items-center gap-5"
            >
              {/* Sparkle icon — matches AppHome branding */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  filter: [
                    'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
                    'drop-shadow(0 0 24px rgba(255,107,53,0.4))',
                    'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="80" height="80" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <circle cx="32" cy="32" r="30" fill="rgba(255,107,53,0.06)" />
                  <path
                    d="M 32 6 C 34 17, 41 24.5, 54 26.5 C 41 28.5, 34 36, 32 47 C 30 36, 23 28.5, 10 26.5 C 23 24.5, 30 17, 32 6 Z"
                    fill="#FF6B35"
                  />
                  <path
                    d="M 49 10 C 49.6 13, 52 15.5, 55 16 C 52 16.5, 49.6 19, 49 22 C 48.4 19, 46 16.5, 43 16 C 46 15.5, 48.4 13, 49 10 Z"
                    fill="#FF6B35"
                    opacity="0.45"
                  />
                </svg>
              </motion.div>
              {/* App name */}
              <p
                className="font-display text-[15px] font-semibold tracking-[0.35em] uppercase"
                style={{ color: '#48484A' }}
              >
                MatKompass
              </p>
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
