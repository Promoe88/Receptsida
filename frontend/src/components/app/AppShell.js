// ============================================
// AppShell — Native app layout wrapper
// Bottom tab bar + content area (no navbar/footer)
// OnboardingGate enforces: Tutorial → Login → App
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import { BottomTabBar } from './BottomTabBar';
import { OnboardingGate } from './OnboardingGate';

// Routes where tab bar is hidden (auth flows, onboarding)
const HIDE_TABS = ['/login', '/register', '/tutorial', '/verify', '/forgot-password', '/reset-password'];

export function AppShell({ children }) {
  const pathname = usePathname();
  const showTabs = !HIDE_TABS.some((r) => pathname.startsWith(r));

  return (
    <div className="app-shell">
      <OnboardingGate>
        <main className={showTabs ? 'pb-20' : ''}>
          {children}
        </main>
        {showTabs && <BottomTabBar />}
      </OnboardingGate>
    </div>
  );
}
