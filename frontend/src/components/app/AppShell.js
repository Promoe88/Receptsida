// ============================================
// AppShell — Native app layout wrapper
// Bottom tab bar + content area (no navbar/footer)
// OnboardingGate enforces: Tutorial → Login → App
// Fixed viewport — nothing goes under Dynamic Island
// ============================================

'use client';

import { usePathname } from 'next/navigation';
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

  return (
    <div className="app-shell app-viewport">
      <OnboardingGate>
        <main className={`app-main ${isFixed ? 'app-main--fixed' : 'app-main--scroll'}`}>
          {children}
        </main>
        {showTabs && <BottomTabBar />}
      </OnboardingGate>
    </div>
  );
}
