// ============================================
// Login Page
// ============================================

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      await login(email, password);
      router.push(redirect);
    } catch {
      // Error handled by store
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-brand-400 rounded-full flex items-center justify-center
                        text-white text-2xl mx-auto mb-4">
            🍳
          </div>
          <h1 className="font-display text-3xl text-warm-800">Välkommen tillbaka</h1>
          <p className="text-warm-500 mt-2">Logga in för att hitta dina recept</p>
        </div>

        <div className="card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="din@email.se"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Lösenord</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <LogIn size={18} />
              )}
              Logga in
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-warm-500 mt-5">
          Har du inget konto?{' '}
          <Link href="/register" className="text-brand-400 font-semibold hover:underline">
            Skapa konto gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
