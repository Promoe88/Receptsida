// ============================================
// Navbar — Dark theme header with accent
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../lib/store';
import { Menu, X, User, LogOut, Heart, Clock, ChefHat, Terminal } from 'lucide-react';

export function Navbar() {
  const { user, loading, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-800/60 bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-accent-400 rounded-xl flex items-center justify-center
                          group-hover:scale-105 transition-transform shadow-glow-sm">
              <ChefHat size={16} className="text-void" />
            </div>
            <span className="font-display text-lg text-zinc-100">MatKompass</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-accent-400
                                    px-3 py-2 rounded-xl hover:bg-surface-200 transition-all">
              Recept
            </Link>
            {user && (
              <>
                <Link href="/favoriter" className="text-sm font-medium text-zinc-500 hover:text-accent-400
                                                  px-3 py-2 rounded-xl hover:bg-surface-200 transition-all">
                  Favoriter
                </Link>
                <Link href="/historik" className="text-sm font-medium text-zinc-500 hover:text-accent-400
                                                px-3 py-2 rounded-xl hover:bg-surface-200 transition-all">
                  Historik
                </Link>
              </>
            )}

            <div className="w-px h-6 bg-zinc-800 mx-2" />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-surface-300 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-400
                           px-3 py-2 rounded-xl hover:bg-surface-200 transition-all"
                >
                  <div className="w-7 h-7 bg-accent-400/15 text-accent-400 rounded-lg flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="hidden lg:inline text-zinc-300">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-300/95 backdrop-blur-xl
                                border border-zinc-800 rounded-xl shadow-strong
                                animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-zinc-200 truncate">{user.email}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {user.plan === 'FREE' ? 'Gratisplan' : 'Premium'}
                      </p>
                    </div>
                    <Link
                      href="/favoriter"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-surface-200 hover:text-zinc-200 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Heart size={15} /> Favoriter
                    </Link>
                    <Link
                      href="/historik"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-surface-200 hover:text-zinc-200 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Clock size={15} /> Historik
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10
                               transition-colors w-full border-t border-zinc-800"
                    >
                      <LogOut size={15} /> Logga ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm">
                  Logga in
                </Link>
                <Link href="/register" className="btn-accent text-sm !py-2 !px-4">
                  Kom igång
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 rounded-xl
                     hover:bg-surface-200 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 py-3 animate-slide-down">
            <div className="flex flex-col gap-1">
              <Link href="/" className="px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-surface-200 rounded-xl"
                    onClick={() => setMobileOpen(false)}>
                <Terminal size={15} className="inline mr-2 text-accent-400" /> Recept
              </Link>
              {user ? (
                <>
                  <Link href="/favoriter" className="px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-surface-200 rounded-xl"
                        onClick={() => setMobileOpen(false)}>
                    <Heart size={15} className="inline mr-2" /> Favoriter
                  </Link>
                  <Link href="/historik" className="px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-surface-200 rounded-xl"
                        onClick={() => setMobileOpen(false)}>
                    <Clock size={15} className="inline mr-2" /> Historik
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-xl text-left"
                  >
                    <LogOut size={15} className="inline mr-2" /> Logga ut
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="btn-surface flex-1 text-center text-sm"
                        onClick={() => setMobileOpen(false)}>
                    Logga in
                  </Link>
                  <Link href="/register" className="btn-accent flex-1 text-center text-sm"
                        onClick={() => setMobileOpen(false)}>
                    Kom igång
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
