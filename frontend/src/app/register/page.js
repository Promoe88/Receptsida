// ============================================
// Register Page — Identical layout to Login
// Centered icon, same card structure, strength meter
// ============================================

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { Eye, EyeOff, Loader2, ArrowRight, Check, X, ChevronLeft } from 'lucide-react';

const PASSWORD_RULES = [
  { id: 'length', label: 'Minst 8 tecken', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'Stor bokstav (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'Liten bokstav (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'Siffra (0–9)', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'Specialtecken (!@#$...)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function PasswordStrengthIndicator({ password }) {
  const results = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) })),
    [password]
  );

  const metCount = results.filter((r) => r.met).length;
  const strength = metCount <= 1 ? 0 : metCount <= 3 ? 1 : 2;
  const strengthLabels = ['Svagt', 'Medel', 'Starkt'];
  const strengthColors = ['bg-terra-400', 'bg-amber-400', 'bg-sage-400'];
  const textColors = ['text-terra-500', 'text-amber-600', 'text-sage-500'];

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= strength ? strengthColors[strength] : 'bg-warm-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-[11px] font-bold ${textColors[strength]}`}>
          {strengthLabels[strength]}
        </span>
      </div>
      <div className="space-y-1">
        {results.map((rule) => (
          <div key={rule.id} className="flex items-center gap-1.5">
            {rule.met ? (
              <Check size={12} className="text-sage-400 flex-shrink-0" strokeWidth={3} />
            ) : (
              <X size={12} className="text-warm-300 flex-shrink-0" strokeWidth={3} />
            )}
            <span className={`text-[11px] ${rule.met ? 'text-sage-500 font-medium' : 'text-warm-400'}`}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const { register, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordValid = useMemo(
    () => PASSWORD_RULES.every((rule) => rule.test(password)),
    [password]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!acceptedPrivacy || !passwordValid) return;
    clearError();
    setSubmitting(true);
    try {
      await register(email, password, name || undefined);
      router.push('/tutorial');
    } catch {} finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card p-6 shadow-card-deep">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-warm-800 mb-1.5 block">
            Namn <span className="text-warm-400">(valfritt)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Ditt namn"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-warm-800 mb-1.5 block">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="din@email.se"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-warm-800 mb-1.5 block">Lösenord</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-12"
              placeholder="Minst 8 tecken"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordStrengthIndicator password={password} />
        </div>

        {/* Privacy consent */}
        <label className="flex gap-2.5 cursor-pointer items-start">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-sage-400 flex-shrink-0"
            required
          />
          <span className="text-[11px] text-warm-500 leading-relaxed">
            Jag godkänner{' '}
            <Link href="/integritetspolicy" target="_blank" className="text-sage-400 underline font-medium">
              integritetspolicyn
            </Link>{' '}
            och samtycker till GDPR.
          </span>
        </label>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-danger-50 border border-danger/20 text-terra-600 px-4 py-2.5 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <NisseButton type="submit" variant="primary" disabled={submitting || !acceptedPrivacy || !passwordValid} fullWidth>
          {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Skapa konto'}
          {!submitting && <ArrowRight size={18} />}
        </NisseButton>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PageTransition>
      <div className="flex-1 flex flex-col soft-scroll app-inner-scroll px-5 py-6 bg-cream">
        <div className="w-full max-w-md mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm font-medium text-warm-500 hover:text-warm-800 transition-colors mb-4 -ml-1"
            >
              <ChevronLeft size={20} />
              Tillbaka
            </Link>
            <h1 className="font-display text-3xl font-bold text-warm-900 tracking-tight text-center">Skapa konto</h1>
            <p className="text-warm-500 mt-2 font-medium text-center">Kom igång med Nisse</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <RegisterForm />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-warm-500 mt-6"
          >
            Har du redan ett konto?{' '}
            <Link href="/login" className="text-terra-400 font-bold hover:underline">
              Logga in
            </Link>
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}
