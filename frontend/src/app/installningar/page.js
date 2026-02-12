// ============================================
// Inställningar — GDPR data management
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import {
  Shield, Download, Trash2, MapPin, Cookie,
  AlertTriangle, Check, Loader2, User,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-warm-500 mb-4">Du måste vara inloggad för att se inställningar.</p>
          <Link href="/login" className="btn-primary text-sm">Logga in</Link>
        </div>
      </div>
    );
  }

  async function handleExport() {
    setExporting(true);
    try {
      const data = await gdpr.exportData();
      // Trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nisse-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExported(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    if (deleteEmail !== user.email) {
      setError('E-postadressen matchar inte ditt konto.');
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      await gdpr.deleteAccount(deleteEmail);
      await logout();
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-warm-800">Inställningar</h1>
        <p className="text-warm-500 mt-1">Hantera ditt konto och din data</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-sage-500" />
            <h2 className="font-semibold text-warm-800">Profil</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">E-post</span>
              <span className="text-warm-700">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Namn</span>
              <span className="text-warm-700">{user.name || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-warm-100">
              <span className="text-warm-500">Inloggningsmetod</span>
              <span className="text-warm-700">
                {user.authProvider === 'GOOGLE' ? 'Google' : user.authProvider === 'APPLE' ? 'Apple' : 'E-post'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-warm-500">Plan</span>
              <span className="text-warm-700">{user.plan === 'FREE' ? 'Gratis' : 'Premium'}</span>
            </div>
          </div>
        </div>

        {/* Privacy & GDPR */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-warm-600" />
            <h2 className="font-semibold text-warm-800">Integritet & GDPR</h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/integritetspolicy"
              className="flex items-center justify-between py-3 px-4 rounded-2xl bg-cream-200/50 hover:bg-cream-300/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-warm-500" />
                <span className="text-sm font-medium text-warm-700">Integritetspolicy</span>
              </div>
              <span className="text-warm-400 text-xs">Läs mer</span>
            </Link>

            {/* Data export */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-between w-full py-3 px-4 rounded-2xl bg-cream-200/50 hover:bg-cream-300/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {exporting ? (
                  <Loader2 size={16} className="text-sage-500 animate-spin" />
                ) : exported ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Download size={16} className="text-sage-500" />
                )}
                <span className="text-sm font-medium text-warm-700">
                  {exported ? 'Data exporterad!' : 'Exportera min data'}
                </span>
              </div>
              <span className="text-warm-400 text-xs">GDPR Art. 20</span>
            </button>
          </div>
        </div>

        {/* Danger zone — Delete account */}
        <div className="card p-5 border-terra-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-terra-500" />
            <h2 className="font-semibold text-terra-600">Radera konto</h2>
          </div>

          {!deleteConfirm ? (
            <div>
              <p className="text-sm text-warm-500 mb-3">
                Att radera ditt konto tar bort all din data permanent. Detta kan inte ångras.
              </p>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-sm text-terra-500 hover:text-terra-600 font-medium transition-colors"
              >
                Jag vill radera mitt konto
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-terra-600 font-medium">
                Skriv in din e-postadress för att bekräfta:
              </p>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder={user.email}
                className="input border-terra-200 focus:ring-terra-300"
              />
              {error && (
                <p className="text-xs text-terra-500">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting || deleteEmail !== user.email}
                  className="flex items-center gap-2 py-2 px-4 rounded-2xl bg-terra-500 text-white text-sm
                           font-medium hover:bg-terra-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Radera permanent
                </button>
                <button
                  onClick={() => { setDeleteConfirm(false); setDeleteEmail(''); setError(null); }}
                  className="btn-ghost text-sm"
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
