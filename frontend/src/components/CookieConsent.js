// ============================================
// Cookie Consent Banner — GDPR-compliant
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, X } from 'lucide-react';
import { gdpr } from '../lib/api';
import { useAuthStore } from '../lib/store';

const COOKIE_CONSENT_KEY = 'nisse_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) {
        // Small delay to avoid flash
        const timer = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
    // Record consent in backend if logged in
    if (user) {
      gdpr.recordConsent('COOKIES', true).catch(() => {});
    }
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
    if (user) {
      gdpr.recordConsent('COOKIES', false).catch(() => {});
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 safe-bottom">
      <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-xl border border-warm-200
                    rounded-3xl shadow-elevated p-5 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-warm-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-warm-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-warm-800 mb-1">Cookies & integritet</h3>
            <p className="text-xs text-warm-500 leading-relaxed mb-3">
              Vi använder nödvändiga cookies för att appen ska fungera. Inga tredjepartscookies eller
              spårning utan ditt samtycke.{' '}
              <Link href="/integritetspolicy" className="text-sage-500 underline">
                Läs mer
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="btn-primary text-xs !py-2 !px-4"
              >
                Godkänn
              </button>
              <button
                onClick={handleDecline}
                className="btn-ghost text-xs !py-2 !px-4"
              >
                Bara nödvändiga
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-warm-400 hover:text-warm-600 transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
