// ============================================
// Social Login Buttons — Google & Apple Sign-In
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';

// ── Google Sign-In Button ──

export function GoogleLoginButton({ onSuccess, redirectTo = '/' }) {
  const router = useRouter();
  const { googleLogin, error } = useAuthStore();
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      // Use Google Identity Services (GIS) to get ID token
      if (typeof window === 'undefined' || !window.google?.accounts?.id) {
        // Fallback: redirect to Google OAuth consent screen
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error('Google-inloggning är inte konfigurerad.');
        }

        // Prompt using GIS
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.prompt();
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google-inloggning är inte konfigurerad.');
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error('Google login error:', err);
      setLoading(false);
    }
  }

  async function handleCredentialResponse(response) {
    try {
      const { user, isNewUser } = await googleLogin(response.credential);
      onSuccess?.({ user, isNewUser });
      if (isNewUser) {
        router.push('/tutorial');
      } else {
        router.push(redirectTo);
      }
    } catch {
      // Error is handled in store
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full
               bg-white hover:bg-warm-50 transition-all text-sm font-semibold text-warm-700
               disabled:opacity-50"
      style={{ border: '1px solid #DCDCDC' }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" className="flex-shrink-0">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {loading ? 'Loggar in...' : 'Fortsätt med Google'}
    </button>
  );
}

// ── Apple Sign-In Button ──

export function AppleLoginButton({ onSuccess, redirectTo = '/' }) {
  const router = useRouter();
  const { appleLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);

  async function handleAppleLogin() {
    setLoading(true);
    try {
      if (typeof window === 'undefined' || !window.AppleID?.auth) {
        throw new Error('Apple-inloggning är inte tillgänglig i denna webbläsare.');
      }

      const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Apple-inloggning är inte konfigurerad.');
      }

      const response = await window.AppleID.auth.signIn({
        clientId,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const { user, isNewUser } = await appleLogin(
        response.authorization.id_token,
        response.authorization.code,
        response.user // Contains name on first sign-in
      );

      onSuccess?.({ user, isNewUser });
      if (isNewUser) {
        router.push('/tutorial');
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      if (err.message !== 'popup_closed_by_user') {
        console.error('Apple login error:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAppleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full
               hover:opacity-90 shadow-medium transition-all text-sm font-bold text-white
               disabled:opacity-50"
      style={{ backgroundColor: '#111111' }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white" className="flex-shrink-0">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
      {loading ? 'Loggar in...' : 'Fortsätt med Apple'}
    </button>
  );
}

// ── Combined Social Login Section ──

export function SocialLoginSection({ redirectTo }) {
  return (
    <div className="space-y-3">
      <GoogleLoginButton redirectTo={redirectTo} />
      <AppleLoginButton redirectTo={redirectTo} />
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-warm-300" />
        <span className="text-xs text-warm-500 font-semibold tracking-wider">ELLER</span>
        <div className="flex-1 h-px bg-warm-300" />
      </div>
    </div>
  );
}
