// ============================================
// OnboardingGate — Enforces onboarding flow for native app
// Flow: Tutorial → Login → Main App
// Bypass routes (auth/onboarding pages) are always accessible
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { isApp } from '../../lib/platform';

// Routes that are always accessible (auth & onboarding flows)
const BYPASS_ROUTES = [
  '/login',
  '/register',
  '/tutorial',
  '/verify',
  '/forgot-password',
  '/reset-password',
  '/integritetspolicy',
];

export function OnboardingGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [allowed, setAllowed] = useState(false);

  const isBypassRoute = BYPASS_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    // Web mode: no gate needed
    if (!isApp) {
      setAllowed(true);
      return;
    }

    // Auth/onboarding routes: always accessible
    if (isBypassRoute) {
      setAllowed(true);
      return;
    }

    // Wait for auth state to initialize
    if (loading) {
      setAllowed(false);
      return;
    }

    // Step 1: Check if tutorial has been completed
    const tutorialSeen = localStorage.getItem('nisse_tutorial_seen');
    if (!tutorialSeen) {
      setAllowed(false);
      router.replace('/tutorial');
      return;
    }

    // Step 2: Check if user is logged in
    if (!user) {
      setAllowed(false);
      router.replace('/login');
      return;
    }

    // All checks passed — allow access
    setAllowed(true);
  }, [pathname, user, loading, router, isBypassRoute]);

  if (!allowed) return null;

  return <>{children}</>;
}
