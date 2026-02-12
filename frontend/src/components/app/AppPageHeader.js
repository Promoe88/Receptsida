// ============================================
// AppPageHeader — Renders AppHeader only in native app
// Safe to use in both server and client components
// ============================================

'use client';

import { isApp } from '../../lib/platform';
import { AppHeader } from './AppHeader';

export function AppPageHeader({ title, showBack = false, rightAction }) {
  if (!isApp) return null;
  return <AppHeader title={title} showBack={showBack} rightAction={rightAction} />;
}
