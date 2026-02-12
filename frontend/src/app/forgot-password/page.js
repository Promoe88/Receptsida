// ============================================
// Forgot Password Page — Warm Scandinavian aesthetic
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '../../lib/api';
import { Mail, ArrowLeft, CheckCircle, ChefHat } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await auth.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Något gick fel.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-terra-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-terra-400" />
          </div>
          <h1 className="font-display text-3xl text-warm-800">Glömt lösenord</h1>
          <p className="text-warm-500 mt-2">
            Ange din e-post så skickar vi en återställningslänk.
          </p>
        </div>

        {sent ? (
          <div className="card p-8 text-center">
            <CheckCircle size={48} className="text-sage-400 mx-auto mb-4" />
            <h2 className="font-display text-xl text-warm-800 mb-2">Kolla din inkorg</h2>
            <p className="text-warm-500 mb-6">
              Om <strong className="text-warm-700">{email}</strong> finns i vårt system har vi
              skickat en återställningslänk.
            </p>
            <p className="text-warm-400 text-sm">
              Hittar du inte mailet? Kolla skräpposten.
            </p>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">
                  E-post
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="din@email.se"
                  required
                  autoFocus
                />
              </div>
              {error && (
                <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-2.5 rounded-2xl text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-terra w-full flex items-center justify-center gap-2"
              >
                {submitting ? <span className="animate-spin">...</span> : <Mail size={18} />}
                Skicka återställningslänk
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-warm-500 mt-5">
          <Link
            href="/login"
            className="text-sage-500 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </div>
  );
}
