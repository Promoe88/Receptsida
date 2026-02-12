// ============================================
// Register Page — Compact, iPhone-optimized
// Side-by-side social, tight spacing
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { Eye, EyeOff, Loader2, User, Users, UsersRound, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { SocialLoginSectionCompact } from '../../components/SocialLoginButtons';

const HOUSEHOLDS = [
  { value: 1, Icon: User, label: 'Singel' },
  { value: 2, Icon: Users, label: 'Par' },
  { value: 4, Icon: UsersRound, label: 'Familj' },
  { value: 6, Icon: Home, label: 'Stor familj' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!acceptedPrivacy) return;
    clearError();
    setSubmitting(true);

    try {
      await register(email, password, name || undefined, householdSize);
      router.push('/tutorial');
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col overflow-y-auto app-inner-scroll px-5 pt-3 pb-6" style={{ background: '#F2F4F3' }}>
        {/* Header row: back + title inline */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-soft text-warm-600 hover:text-warm-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-warm-900 tracking-tight leading-tight">Kom igång med Nisse</h1>
            <p className="text-warm-500 text-xs font-medium">Din personliga matassistent</p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card p-5 shadow-card-deep">
              {/* Social login — compact side-by-side */}
              <SocialLoginSectionCompact redirectTo="/tutorial" />

              {/* Email/password form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-warm-600 uppercase tracking-wider mb-1 block">
                    Namn <span className="text-warm-400 font-normal normal-case">(valfritt)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input !py-3"
                    placeholder="Ditt namn"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-warm-600 uppercase tracking-wider mb-1 block">E-post</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input !py-3"
                    placeholder="din@email.se"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-warm-600 uppercase tracking-wider mb-1 block">Lösenord</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input !py-3 pr-12"
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
                </div>

                {/* Household selector */}
                <div>
                  <label className="text-[11px] font-bold text-warm-600 uppercase tracking-wider mb-1.5 block">Ditt hushåll</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {HOUSEHOLDS.map((h) => (
                      <motion.button
                        key={h.value}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setHouseholdSize(h.value)}
                        className={`py-2 rounded-xl border-2 text-center transition-all duration-200
                          ${householdSize === h.value
                            ? 'border-sage-400 bg-sage-50 shadow-sage-glow'
                            : 'border-warm-200 bg-cream-200/50 hover:border-warm-300'
                          }`}
                      >
                        <h.Icon size={18} className={householdSize === h.value ? 'text-sage-500' : 'text-warm-400'} strokeWidth={2} />
                        <span className="text-[10px] font-medium text-warm-500 mt-0.5 block">{h.label}</span>
                      </motion.button>
                    ))}
                  </div>
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
                    className="bg-terra-50 border border-terra-200 text-terra-600 px-3 py-2 rounded-xl text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                <NisseButton type="submit" variant="black" disabled={submitting || !acceptedPrivacy} fullWidth>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Skapa konto'}
                  {!submitting && <ArrowRight size={18} />}
                </NisseButton>
              </form>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-warm-500 mt-4"
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
