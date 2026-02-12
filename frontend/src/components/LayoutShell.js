// ============================================
// LayoutShell — Platform-aware layout switcher
// Web: Navbar + Footer + CookieConsent
// App: Bottom tab bar (native feel)
// ============================================

'use client';

import { isApp } from '../lib/platform';
import { AppShell } from './app/AppShell';
import { WebShell } from './web/WebShell';

export function LayoutShell({ children }) {
  if (isApp) return <AppShell>{children}</AppShell>;
  return <WebShell>{children}</WebShell>;
}
