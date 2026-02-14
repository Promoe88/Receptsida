// ============================================
// Login Page — Dual-panel split-screen (web) / Centered card (app)
// Left: Clean white form. Right: Sage Green branding panel.
// ============================================

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { isWeb } from '../../lib/platform';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { Eye, EyeOff, Loader2, ArrowRight, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Track focused field for floating labels
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email — floating label */}
      <div className="relative">
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className="input peer pt-6 pb-2"
          placeholder=" "
          required
        />
        <label
          htmlFor="login-email"
          className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${emailActive
              ? 'top-1.5 text-[11px] font-semibold text-forest-500'
              : 'top-4 text-sm text-warm-400'
            }`}
        >
          E-postadress
        </label>
      </div>

      {/* Password — floating label */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          className="input peer pt-6 pb-2 pr-12"
          placeholder=" "
          required
          minLength={8}
        />
        <label
          htmlFor="login-password"
          className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${passwordActive
              ? 'top-1.5 text-[11px] font-semibold text-forest-500'
              : 'top-4 text-sm text-warm-400'
            }`}
        >
          Lösenord
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger-50 border border-danger/20 text-terra-600 px-4 py-2.5 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}

      <NisseButton type="submit" variant="primary" disabled={submitting} fullWidth>
        {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Logga in'}
        {!submitting && <ArrowRight size={18} />}
      </NisseButton>

      <div className="text-center pt-1">
        <Link href="/forgot-password" className="text-sm text-warm-400 hover:text-forest-500 transition-colors">
          Glömt lösenord?
        </Link>
      </div>
    </form>
  );
}

// ── Branding panel (right side, web only) ──
function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#5A7D6C' }}
    >
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#D97757', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#D97757', transform: 'translate(-30%, 30%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-12"
      >
        <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Sparkles size={36} className="text-white" />
        </div>
        <h2 className="font-display text-4xl font-bold text-white tracking-tight leading-tight mb-4">
          Din personliga<br />matassistent
        </h2>
        <p className="text-white/70 text-lg leading-relaxed max-w-sm mx-auto">
          Hitta recept, jämför priser hos ICA, Willys, Coop & Lidl. Allt i en app.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  // ── Web: Dual panel split-screen ──
  if (isWeb) {
    return (
      <div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-2">
        {/* Left panel — form */}
        <div className="flex flex-col justify-center px-5 sm:px-12 lg:px-20 py-8 sm:py-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ color: '#111111' }}>
                Välkommen tillbaka
              </h1>
              <p className="text-warm-500 text-sm sm:text-base">
                Logga in på ditt Nisse-konto
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Suspense fallback={<div className="animate-pulse h-64 rounded-2xl bg-cream-200" />}>
                <LoginForm />
              </Suspense>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-warm-500 mt-8"
            >
              Har du inget konto?{' '}
              <Link href="/register" className="text-forest-500 font-bold hover:underline">
                Skapa konto
              </Link>
            </motion.p>
          </div>
        </div>

        {/* Right panel — branding */}
        <BrandingPanel />
      </div>
    );
  }

  // ── App: Centered card (unchanged behavior) ──
  return (
    <PageTransition>
      <div className="flex-1 flex flex-col soft-scroll app-inner-scroll px-5 py-6 bg-cream">
        <div className="w-full max-w-md mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-sage-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Sparkles size={30} className="text-sage-400" strokeWidth={2} />
            </div>
            <h1 className="font-display text-3xl font-bold text-warm-900 tracking-tight">Välkommen</h1>
            <p className="text-warm-500 mt-2 font-medium">Logga in på Nisse</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card p-6 shadow-card-deep">
              <Suspense fallback={<div className="card animate-pulse h-64" />}>
                <LoginForm />
              </Suspense>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-warm-500 mt-6"
          >
            Har du inget konto?{' '}
            <Link href="/register" className="text-terra-400 font-bold hover:underline">
              Skapa konto
            </Link>
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}
