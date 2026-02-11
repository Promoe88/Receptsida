// ============================================
// Register Page
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
      // Error handled by store
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-brand-400 rounded-full flex items-center justify-center
                        text-white text-2xl mx-auto mb-4">
            🍳
          </div>
          <h1 className="font-display text-3xl text-warm-800">Skapa konto</h1>
          <p className="text-warm-500 mt-2">Gratis — hitta recept baserat på vad du har hemma</p>
        </div>

        <div className="card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Namn <span className="text-warm-400 font-normal">(valfritt)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="din@email.se"
                required
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
                  placeholder="Minst 8 tecken"
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

            {/* Household selector */}
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2.5">
                Ditt hushåll
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HOUSEHOLDS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setHouseholdSize(h.value)}
                    className={`py-3 rounded-xl border-2 text-center transition-all duration-200
                      ${householdSize === h.value
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-warm-200 bg-warm-50 hover:border-warm-300'
                      }`}
                  >
                    <span className="text-xl block">{h.emoji}</span>
                    <span className="text-xs font-medium text-warm-700 mt-1 block">{h.label}</span>
                  </button>
                ))}
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
                <UserPlus size={18} />
              )}
              Skapa konto
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-warm-500 mt-5">
          Har du redan ett konto?{' '}
          <Link href="/login" className="text-brand-400 font-semibold hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
