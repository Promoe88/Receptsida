// ============================================
// WebShell — Classic website layout
// Navbar + content + footer + cookie consent
// ============================================

'use client';

import { Navbar } from '../Navbar';
import { CookieConsent } from '../CookieConsent';

export function WebShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-warm-200 py-10 px-6 bg-cream-200 safe-bottom">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sage-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <p className="text-sm text-warm-600 font-medium">Nisse</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/integritetspolicy" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
              Integritetspolicy
            </a>
            <a href="/installningar" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
              Inställningar
            </a>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </>
  );
}
