// ============================================
// Login Page — Clean, high-conversion form
// Apple/Google/Email options with native-feel
// ============================================

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { LogIn, Eye, EyeOff, ChefHat, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="card p-6 shadow-card-deep">
      {/* Social login */}
      <SocialLoginSection redirectTo={redirect} />

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-warm-600 uppercase tracking-wider mb-1.5 block">E-post</label>
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
          <label className="text-xs font-bold text-warm-600 uppercase tracking-wider mb-1.5 block">Lösenord</label>
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-2.5 rounded-2xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <NisseButton type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Logga in'}
          {!submitting && <ArrowRight size={18} />}
        </NisseButton>

        <div className="text-center pt-1">
          <Link href="/forgot-password" className="text-sm text-warm-400 hover:text-sage-400 transition-colors">
            Glömt lösenord?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageTransition>
      <div className="flex-1 flex flex-col overflow-y-auto app-inner-scroll px-5 py-6 bg-cream">
        <div className="w-full max-w-md mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-sage-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
              <ChefHat size={30} className="text-sage-400" strokeWidth={2} />
            </div>
            <h1 className="font-display text-3xl font-bold text-warm-900 tracking-tight">Välkommen</h1>
            <p className="text-warm-500 mt-2 font-medium">Logga in på Nisse</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense fallback={<div className="card animate-pulse h-64" />}>
              <LoginForm />
            </Suspense>
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
