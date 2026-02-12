// ============================================
// Reset Password Page — Warm Scandinavian aesthetic
// ============================================

'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../lib/api';
import { Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';

function ResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md">
          <Lock size={48} className="text-terra-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-warm-800 mb-2">Ogiltig länk</h1>
          <p className="text-warm-500 mb-6">Ingen giltig återställningstoken hittades.</p>
          <Link href="/forgot-password" className="btn-primary inline-block">
            Begär ny länk
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setSubmitting(true);
    try {
      await auth.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Något gick fel.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md">
          <CheckCircle size={48} className="text-sage-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-warm-800 mb-2">Lösenord uppdaterat!</h1>
          <p className="text-warm-500 mb-6">Ditt lösenord har ändrats. Logga in med ditt nya lösenord.</p>
          <Link href="/login" className="btn-primary inline-block">
            Logga in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-sage-500" />
          </div>
          <h1 className="font-display text-3xl text-warm-800">Nytt lösenord</h1>
          <p className="text-warm-500 mt-2">Välj ett nytt säkert lösenord.</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">
                Nytt lösenord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="Minst 8 tecken"
                  required
                  minLength={8}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">
                Bekräfta lösenord
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Upprepa lösenordet"
                required
                minLength={8}
              />
            </div>
            {error && (
              <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-2.5 rounded-2xl text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {submitting ? <span className="animate-spin">...</span> : <Lock size={18} />}
              Uppdatera lösenord
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="text-sage-400 animate-spin" />
        </div>
      }
    >
      <ResetContent />
    </Suspense>
  );
}
