// ============================================
// Register Page — Dark theme
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const HOUSEHOLDS = [
  { value: 1, emoji: '👤', label: 'Singel' },
  { value: 2, emoji: '👫', label: 'Par' },
  { value: 4, emoji: '👨‍👩‍👧', label: 'Familj' },
  { value: 6, emoji: '👨‍👩‍👧‍👦', label: 'Stor familj' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      await register(email, password, name || undefined, householdSize);
      router.push('/');
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-accent-400 rounded-xl flex items-center justify-center
                        text-void text-2xl mx-auto mb-4 shadow-glow-sm">
            🍳
          </div>
          <h1 className="font-display text-3xl text-zinc-100">Skapa konto</h1>
          <p className="text-zinc-500 mt-2">Gratis — hitta recept baserat på vad du har hemma</p>
        </div>

        <div className="card-dark p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-sm mb-1.5 block">
                Namn <span className="text-zinc-600 font-normal">(valfritt)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label className="label-sm mb-1.5 block">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                placeholder="din@email.se"
                required
              />
            </div>

            <div>
              <label className="label-sm mb-1.5 block">Lösenord</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-12"
                  placeholder="Minst 8 tecken"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Household selector */}
            <div>
              <label className="label-sm mb-2.5 block">Ditt hushåll</label>
              <div className="grid grid-cols-4 gap-2">
                {HOUSEHOLDS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setHouseholdSize(h.value)}
                    className={`py-3 rounded-xl border-2 text-center transition-all duration-200
                      ${householdSize === h.value
                        ? 'border-accent-400/50 bg-accent-400/10'
                        : 'border-zinc-800 bg-surface-300 hover:border-zinc-700'
                      }`}
                  >
                    <span className="text-xl block">{h.emoji}</span>
                    <span className="text-xs font-medium text-zinc-400 mt-1 block">{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-2.5 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-accent w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <UserPlus size={18} />
              )}
              Skapa konto
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Har du redan ett konto?{' '}
          <Link href="/login" className="text-accent-400 font-semibold hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
