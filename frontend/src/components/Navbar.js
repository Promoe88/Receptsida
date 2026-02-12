// ============================================
// Navbar — Warm Scandinavian header
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../lib/store';
import { Menu, X, User, LogOut, Heart, Clock, ChefHat } from 'lucide-react';

export function Navbar() {
  const { user, loading, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="border-b border-warm-200/60 bg-cream/90 backdrop-blur-xl sticky top-0 z-50 safe-top">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-sage-400 rounded-2xl flex items-center justify-center
                          group-hover:scale-105 transition-transform shadow-sage-glow">
              <ChefHat size={17} className="text-white" />
            </div>
            <span className="font-display text-xl text-warm-800">MatKompass</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-sm font-medium text-warm-500 hover:text-sage-600
                                    px-3 py-2 rounded-xl hover:bg-sage-50 transition-all">
              Recept
            </Link>
            {user && (
              <>
                <Link href="/favoriter" className="text-sm font-medium text-warm-500 hover:text-sage-600
                                                  px-3 py-2 rounded-xl hover:bg-sage-50 transition-all">
                  Favoriter
                </Link>
                <Link href="/historik" className="text-sm font-medium text-warm-500 hover:text-sage-600
                                                px-3 py-2 rounded-xl hover:bg-sage-50 transition-all">
                  Historik
                </Link>
              </>
            )}

            <div className="w-px h-6 bg-warm-200 mx-2" />

            {loading ? (
              <div className="w-9 h-9 rounded-full bg-cream-300 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-warm-600
                           px-3 py-2 rounded-xl hover:bg-warm-100 transition-all"
                >
                  <div className="w-8 h-8 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center">
                    <User size={15} />
                  </div>
                  <span className="hidden lg:inline text-warm-700">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl
                                border border-warm-200 rounded-2xl shadow-elevated
                                animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-warm-100">
                      <p className="text-sm font-medium text-warm-800 truncate">{user.email}</p>
                      <p className="text-xs text-warm-400 mt-0.5">
                        {user.plan === 'FREE' ? 'Gratisplan' : 'Premium'}
                      </p>
                    </div>
                    <Link
                      href="/favoriter"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-warm-600 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Heart size={15} /> Favoriter
                    </Link>
                    <Link
                      href="/historik"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-warm-600 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Clock size={15} /> Historik
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-terra-500 hover:bg-terra-50
                               transition-colors w-full border-t border-warm-100"
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
                <Link href="/register" className="btn-primary text-sm !py-2 !px-5">
                  Kom igång
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-warm-500 hover:text-warm-800 rounded-xl
                     hover:bg-warm-100 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-warm-200 py-3 animate-slide-down">
            <div className="flex flex-col gap-1">
              <Link href="/" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-sage-50 rounded-xl"
                    onClick={() => setMobileOpen(false)}>
                Recept
              </Link>
              {user ? (
                <>
                  <Link href="/favoriter" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-sage-50 rounded-xl"
                        onClick={() => setMobileOpen(false)}>
                    <Heart size={15} className="inline mr-2 text-terra-400" /> Favoriter
                  </Link>
                  <Link href="/historik" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-sage-50 rounded-xl"
                        onClick={() => setMobileOpen(false)}>
                    <Clock size={15} className="inline mr-2 text-sage-400" /> Historik
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="px-4 py-3 text-sm font-medium text-terra-500 hover:bg-terra-50 rounded-xl text-left"
                  >
                    <LogOut size={15} className="inline mr-2" /> Logga ut
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="btn-outline flex-1 text-center text-sm"
                        onClick={() => setMobileOpen(false)}>
                    Logga in
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 text-center text-sm"
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
