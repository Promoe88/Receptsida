// ============================================
// Verify Email Page — Warm Scandinavian aesthetic
// ============================================

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../lib/api';
import { CheckCircle, XCircle, Loader2, ChefHat } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Ingen verifieringstoken hittades.');
      return;
    }

    auth
      .verify(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'E-postadressen är verifierad!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verifieringen misslyckades.');
      });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="card p-8">
          {status === 'loading' && (
            <>
              <Loader2 size={48} className="text-sage-400 animate-spin mx-auto mb-4" />
              <h1 className="font-display text-2xl text-warm-800 mb-2">Verifierar...</h1>
              <p className="text-warm-500">Vänta medan vi verifierar din e-postadress.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle size={48} className="text-sage-400 mx-auto mb-4" />
              <h1 className="font-display text-2xl text-warm-800 mb-2">Verifierad!</h1>
              <p className="text-warm-500 mb-6">{message}</p>
              <Link href="/" className="btn-primary inline-block">
                Börja söka recept
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} className="text-terra-400 mx-auto mb-4" />
              <h1 className="font-display text-2xl text-warm-800 mb-2">Något gick fel</h1>
              <p className="text-warm-500 mb-6">{message}</p>
              <Link href="/login" className="btn-primary inline-block">
                Gå till inloggning
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Loader2 size={32} className="text-sage-400 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
