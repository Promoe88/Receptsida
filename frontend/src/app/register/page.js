// ============================================
// Register Page — Dual-panel split-screen (web) / Centered card (app)
// Left: Clean white form with strength meter. Right: Sage Green branding.
// ============================================

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { isWeb } from '../../lib/platform';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { Eye, EyeOff, Loader2, ArrowRight, Check, X, ChevronLeft, Sparkles, ChefHat, ShoppingBag, MapPin } from 'lucide-react';

const PASSWORD_RULES = [
  { id: 'length', label: 'Minst 8 tecken', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'Stor bokstav (A\u2013Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'Liten bokstav (a\u2013z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'Siffra (0\u20139)', test: (pw) => /[0-9]/.test(pw) },
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

  // Floating label tracking
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const nameActive = nameFocused || name.length > 0;
  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name — floating label */}
      <div className="relative">
        <input
          type="text"
          id="reg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          className="input peer pt-6 pb-2"
          placeholder=" "
        />
        <label
          htmlFor="reg-name"
          className={`absolute left-4 transition-all duration-200 pointer-events-none
            ${nameActive
              ? 'top-1.5 text-[11px] font-semibold text-forest-500'
              : 'top-4 text-sm text-warm-400'
            }`}
        >
          Namn (valfritt)
        </label>
      </div>

      {/* Email — floating label */}
      <div className="relative">
        <input
          type="email"
          id="reg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className="input peer pt-6 pb-2"
          placeholder=" "
          required
        />
        <label
          htmlFor="reg-email"
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
          id="reg-password"
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
          htmlFor="reg-password"
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
      <PasswordStrengthIndicator password={password} />

      {/* Privacy consent */}
      <label className="flex gap-2.5 cursor-pointer items-start">
        <input
          type="checkbox"
          checked={acceptedPrivacy}
          onChange={(e) => setAcceptedPrivacy(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-sage-400 flex-shrink-0"
          required
        />
        <span className="text-[12px] text-warm-500 leading-relaxed">
          Jag godkänner{' '}
          <Link href="/integritetspolicy" target="_blank" className="text-forest-500 underline font-medium">
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
  );
}

// ── Branding panel (right side, web only) ──
function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#5A7D6C' }}
    >
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: '#D97757', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#D97757', transform: 'translate(30%, 30%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-12"
      >
        <h2 className="font-display text-4xl font-bold text-white tracking-tight leading-tight mb-6">
          Börja laga<br />smartare idag
        </h2>
        <p className="text-white/70 text-base leading-relaxed max-w-sm mx-auto mb-10">
          Gå med tusentals användare som redan hittar billigare recept och handlar smartare.
        </p>

        {/* Feature highlights */}
        <div className="space-y-4 text-left max-w-xs mx-auto">
          {[
            { icon: ChefHat, text: 'AI-drivna receptförslag' },
            { icon: ShoppingBag, text: 'Jämför priser automatiskt' },
            { icon: MapPin, text: 'Hitta närmaste butik' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon size={18} className="text-white" />
              </div>
              <span className="text-white/90 text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  // ── Web: Dual panel split-screen ──
  if (isWeb) {
    return (
      <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">
        {/* Left panel — form */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm font-medium text-warm-500 hover:text-warm-800 transition-colors mb-5 -ml-1"
              >
                <ChevronLeft size={20} />
                Tillbaka till inloggning
              </Link>
              <h1 className="font-display text-4xl font-bold tracking-tight mb-2" style={{ color: '#111111' }}>
                Skapa konto
              </h1>
              <p className="text-warm-500 text-base">
                Kom igång med Nisse — helt gratis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <RegisterForm />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-warm-500 mt-8"
            >
              Har du redan ett konto?{' '}
              <Link href="/login" className="text-forest-500 font-bold hover:underline">
                Logga in
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
            <div className="card p-6 shadow-card-deep">
              <RegisterForm />
            </div>
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
