// ============================================
// WebShell — Professional web layout
// Navbar + constrained content + 4-column footer + cookie consent
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '../Navbar';
import { CookieConsent } from '../CookieConsent';
import { Sparkles } from 'lucide-react';

// Routes where global header/footer should be hidden (onboarding flow)
const ONBOARDING_ROUTES = ['/tutorial', '/login', '/register', '/verify', '/forgot-password', '/reset-password'];

export function WebShell({ children }) {
  const pathname = usePathname();
  const isOnboarding = ONBOARDING_ROUTES.some((r) => pathname.startsWith(r));

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: '#F5F5F7' }}>
        {children}
      </main>

      {/* Professional 4-column footer */}
      <footer className="border-t border-warm-200/50" style={{ background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-forest-400 rounded-xl flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="font-display text-lg text-white font-semibold">Nisse</span>
              </div>
              <p className="text-sm text-warm-400 leading-relaxed max-w-xs">
                Sveriges smartaste matassistent. Hitta recept, jämför priser och handla enklare.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-4">Produkt</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/">Sök recept</FooterLink>
                <FooterLink href="/butiker">Hitta butiker</FooterLink>
                <FooterLink href="/register">Skapa konto</FooterLink>
              </ul>
            </div>

            {/* Företag */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-4">Företag</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/integritetspolicy">Integritetspolicy</FooterLink>
                <FooterLink href="/installningar">Inställningar</FooterLink>
              </ul>
            </div>

            {/* Resurser */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-4">Resurser</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/login">Logga in</FooterLink>
                <FooterLink href="/register">Kom igång gratis</FooterLink>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-warm-700/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-warm-500">&copy; {new Date().getFullYear()} Nisse. Alla rättigheter förbehållna.</p>
            <div className="flex items-center gap-5">
              <Link href="/integritetspolicy" className="text-xs text-warm-500 hover:text-white transition-colors">
                Integritetspolicy
              </Link>
              <Link href="/installningar" className="text-xs text-warm-500 hover:text-white transition-colors">
                Villkor
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-sm text-warm-400 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
