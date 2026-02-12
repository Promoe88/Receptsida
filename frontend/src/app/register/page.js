// ============================================
// Register Page — Clean, high-conversion form
// Apple/Google/Email with household selector
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { UserPlus, Eye, EyeOff, ChefHat, Loader2, User, Users, UsersRound, Home } from 'lucide-react';
import { SocialLoginSection } from '../../components/SocialLoginButtons';

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
      <div className="flex-1 flex items-center justify-center px-5 py-6 overflow-y-auto app-inner-scroll">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-sage-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <ChefHat size={30} className="text-sage-400" strokeWidth={2} />
            </div>
            <h1 className="font-display text-3xl font-bold text-warm-800 tracking-tight">Kom igang med Nisse</h1>
            <p className="text-warm-400 mt-2 font-medium">Gratis — din personliga matassistent</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card p-6">
              {/* Social login */}
              <SocialLoginSection redirectTo="/tutorial" />

              {/* Email/password form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">
                    Namn <span className="text-warm-400 font-normal normal-case">(valfritt)</span>
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
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">E-post</label>
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
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Lösenord</label>
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
                </div>

                {/* Household selector */}
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-2.5 block">Ditt hushåll</label>
                  <div className="grid grid-cols-4 gap-2">
                    {HOUSEHOLDS.map((h) => (
                      <motion.button
                        key={h.value}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setHouseholdSize(h.value)}
                        className={`py-3 rounded-2xl border-2 text-center transition-all duration-200
                          ${householdSize === h.value
                            ? 'border-sage-400 bg-sage-50 shadow-sage-glow'
                            : 'border-warm-200 bg-cream-200/50 hover:border-warm-300'
                          }`}
                      >
                        <h.Icon size={20} className={householdSize === h.value ? 'text-sage-500' : 'text-warm-400'} strokeWidth={2} />
                        <span className="text-xs font-medium text-warm-500 mt-1 block">{h.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Privacy consent */}
                <label className="flex gap-3 cursor-pointer items-start pt-1">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-sage-400"
                    required
                  />
                  <span className="text-xs text-warm-500 leading-relaxed">
                    Jag godkänner{' '}
                    <Link href="/integritetspolicy" target="_blank" className="text-sage-400 underline font-medium">
                      integritetspolicyn
                    </Link>{' '}
                    och samtycker till att mina personuppgifter behandlas enligt GDPR.
                  </span>
                </label>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-2.5 rounded-2xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <NisseButton type="submit" disabled={submitting || !acceptedPrivacy} fullWidth>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  Skapa konto
                </NisseButton>
              </form>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-warm-500 mt-6"
          >
            Har du redan ett konto?{' '}
            <Link href="/login" className="text-sage-400 font-semibold hover:underline">
              Logga in
            </Link>
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}
