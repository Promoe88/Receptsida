'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { LogIn, Eye, EyeOff } from 'lucide-react';

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
    <div className="card-dark p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-sm mb-1.5 block">E-post</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-dark" placeholder="din@email.se" required autoFocus />
        </div>
        <div>
          <label className="label-sm mb-1.5 block">Lösenord</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} className="input-dark pr-12"
              placeholder="Minst 8 tecken" required minLength={8} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-2.5 rounded-xl text-sm">{error}</div>}
        <button type="submit" disabled={submitting} className="btn-accent w-full flex items-center justify-center gap-2">
          {submitting ? <span className="animate-spin">⏳</span> : <LogIn size={18} />} Logga in
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-accent-400 rounded-xl flex items-center justify-center text-void text-2xl mx-auto mb-4 shadow-glow-sm">🍳</div>
          <h1 className="font-display text-3xl text-zinc-100">Välkommen tillbaka</h1>
          <p className="text-zinc-500 mt-2">Logga in för att hitta dina recept</p>
        </div>
        <Suspense fallback={<div className="card-dark animate-pulse h-64" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-zinc-500 mt-5">
          Har du inget konto? <Link href="/register" className="text-accent-400 font-semibold hover:underline">Skapa konto gratis</Link>
        </p>
      </div>
    </div>
  );
}
