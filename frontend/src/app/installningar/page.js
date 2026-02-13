// ============================================
// Inställningar — Grouped list layout
// Profile, Household, Privacy settings
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { isApp } from '../../lib/platform';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import {
  Shield, Download, Trash2, AlertTriangle, Check, Loader2,
  User, ChevronRight, LogOut, Home, Bell, Lock, FileText, HelpCircle,
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
      <PageTransition>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-16 h-16 bg-sage-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-sage-400" />
            </div>
            <p className="text-warm-500 mb-5">Du måste vara inloggad för att se inställningar.</p>
            <Link href="/login">
              <NisseButton>Logga in</NisseButton>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  async function handleExport() {
    setExporting(true);
    try {
      const data = await gdpr.exportData();
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

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <PageTransition className={isApp ? 'safe-top' : ''}>
      <div className={`max-w-2xl mx-auto px-4 ${isApp ? 'pt-6 pb-8' : 'py-8 sm:py-12'}`}>

        {/* Header (web only) */}
        {!isApp && (
          <div className="mb-8">
            <h1 className="font-display text-3xl text-warm-800">Inställningar</h1>
            <p className="text-warm-500 mt-1">Hantera ditt konto och din data</p>
          </div>
        )}

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 mb-6"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-display text-sage-500">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-warm-800 truncate">{user.name || 'Nisse-användare'}</h2>
              <p className="text-sm text-warm-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-0 divide-y divide-warm-100">
            <SettingRow icon={User} label="Inloggningsmetod"
              value={user.authProvider === 'GOOGLE' ? 'Google' : user.authProvider === 'APPLE' ? 'Apple' : 'E-post'} />
            <SettingRow icon={Home} label="Plan"
              value={user.plan === 'FREE' ? 'Gratis' : 'Premium'} />
          </div>
        </motion.div>

        {/* Household section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <SectionHeader icon={Home} title="Hushåll" />
          <div className="card overflow-hidden">
            <SettingLink icon={User} label="Hushållsstorlek" value={`${user.householdSize || 1} personer`} />
            <SettingLink icon={Bell} label="Notifikationer" value="Av" />
          </div>
        </motion.div>

        {/* Privacy & GDPR section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SectionHeader icon={Shield} title="Integritet & GDPR" />
          <div className="card overflow-hidden">
            <Link href="/integritetspolicy" className="flex items-center justify-between py-3.5 px-5 hover:bg-cream-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-warm-500" />
                <span className="text-sm font-medium text-warm-700">Integritetspolicy</span>
              </div>
              <ChevronRight size={16} className="text-warm-400" />
            </Link>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-between w-full py-3.5 px-5 hover:bg-cream-100 transition-colors border-t border-warm-100"
            >
              <div className="flex items-center gap-3">
                {exporting ? (
                  <Loader2 size={18} className="text-sage-400 animate-spin" />
                ) : exported ? (
                  <Check size={18} className="text-success" />
                ) : (
                  <Download size={18} className="text-sage-400" />
                )}
                <span className="text-sm font-medium text-warm-700">
                  {exported ? 'Data exporterad!' : 'Exportera min data'}
                </span>
              </div>
              <span className="text-[10px] text-warm-400 font-medium">GDPR Art. 20</span>
            </button>
          </div>
        </motion.div>

        {/* Support section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <SectionHeader icon={HelpCircle} title="Support" />
          <div className="card overflow-hidden">
            <SettingLink icon={HelpCircle} label="Hjälpcenter" value="" />
            <SettingLink icon={FileText} label="Villkor" value="" />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <NisseButton variant="outline" fullWidth onClick={handleLogout}>
            <LogOut size={16} /> Logga ut
          </NisseButton>
        </motion.div>

        {/* Danger zone — Delete account */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionHeader icon={AlertTriangle} title="Radera konto" color="text-terra-500" />
          <div className="card p-5">
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
                  className="input border-terra-200 focus:ring-terra-100"
                />
                {error && <p className="text-xs text-terra-500">{error}</p>}
                <div className="flex gap-2">
                  <NisseButton
                    variant="secondary"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting || deleteEmail !== user.email}
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Radera permanent
                  </NisseButton>
                  <NisseButton
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDeleteConfirm(false); setDeleteEmail(''); setError(null); }}
                  >
                    Avbryt
                  </NisseButton>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function SectionHeader({ icon: Icon, title, color = 'text-warm-600' }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <Icon size={14} className={color} />
      <h3 className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{title}</h3>
    </div>
  );
}

function SettingRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-warm-400" />
        <span className="text-sm text-warm-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-warm-800">{value}</span>
    </div>
  );
}

function SettingLink({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5 px-5 border-b border-warm-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-warm-500" />
        <span className="text-sm font-medium text-warm-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-warm-400">{value}</span>}
        <ChevronRight size={16} className="text-warm-300" />
      </div>
    </div>
  );
}
