// ============================================
// Login Page — Warm Scandinavian aesthetic
// ============================================

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import { SocialLoginSection } from '../../components/SocialLoginButtons';

function LoginForm() {
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
    } catch {} finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card p-6">
      {/* Social login */}
      <SocialLoginSection redirectTo={redirect} />

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">E-post</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="input" placeholder="din@email.se" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Lösenord</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} className="input pr-12"
              placeholder="Minst 8 tecken" required minLength={8} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-2.5 rounded-2xl text-sm">
            {error}
          </div>
        )}
        <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {submitting ? <span className="animate-spin">...</span> : <LogIn size={18} />} Logga in
        </button>
        <div className="text-center pt-1">
          <Link href="/forgot-password" className="text-sm text-warm-400 hover:text-sage-500 transition-colors">
            Glömt lösenord?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-sage-500" />
          </div>
          <h1 className="font-display text-3xl text-warm-800">Välkommen tillbaka</h1>
          <p className="text-warm-500 mt-2">Logga in på Nisse</p>
        </div>
        <Suspense fallback={<div className="card animate-pulse h-64" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-warm-500 mt-5">
          Har du inget konto? <Link href="/register" className="text-sage-500 font-semibold hover:underline">Skapa konto gratis</Link>
        </p>
      </div>
    </div>
  );
}
