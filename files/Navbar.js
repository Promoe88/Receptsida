// ============================================
// Navbar — Header navigation with auth
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
    <nav className="border-b border-warm-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-brand-400 rounded-full flex items-center justify-center
                          text-white text-lg group-hover:scale-105 transition-transform">
              🍳
            </div>
            <span className="font-display text-xl text-warm-800">MatKompass</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-warm-500 hover:text-brand-400 transition-colors">
              Sök recept
            </Link>
            {user && (
              <>
                <Link href="/favoriter" className="text-sm font-medium text-warm-500 hover:text-brand-400 transition-colors">
                  Favoriter
                </Link>
                <Link href="/historik" className="text-sm font-medium text-warm-500 hover:text-brand-400 transition-colors">
                  Historik
                </Link>
              </>
            )}

            {/* Auth */}
            {loading ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-warm-600
                           hover:text-warm-800 transition-colors px-3 py-2 rounded-lg hover:bg-warm-50"
                >
                  <div className="w-8 h-8 bg-brand-50 text-brand-400 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden lg:inline">{user.name || user.email.split('@')[0]}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-warm-200 rounded-xl shadow-strong
                                animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-warm-100">
                      <p className="text-sm font-medium text-warm-800 truncate">{user.email}</p>
                      <p className="text-xs text-warm-400 mt-0.5">
                        {user.plan === 'FREE' ? 'Gratisplan' : 'Premium'}
                      </p>
                    </div>
                    <Link
                      href="/favoriter"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-warm-600 hover:bg-warm-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Heart size={16} /> Mina favoriter
                    </Link>
                    <Link
                      href="/historik"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-warm-600 hover:bg-warm-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Clock size={16} /> Sökhistorik
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50
                               transition-colors w-full border-t border-warm-100"
                    >
                      <LogOut size={16} /> Logga ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-ghost text-sm">
                  Logga in
                </Link>
                <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
                  Skapa konto
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-warm-600 hover:text-warm-800"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-warm-100 py-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              <Link href="/" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}>
                🔍 Sök recept
              </Link>
              {user ? (
                <>
                  <Link href="/favoriter" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50 rounded-lg"
                        onClick={() => setMobileOpen(false)}>
                    ❤️ Favoriter
                  </Link>
                  <Link href="/historik" className="px-4 py-3 text-sm font-medium text-warm-600 hover:bg-warm-50 rounded-lg"
                        onClick={() => setMobileOpen(false)}>
                    📋 Historik
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg text-left"
                  >
                    🚪 Logga ut
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="btn-secondary flex-1 text-center text-sm"
                        onClick={() => setMobileOpen(false)}>
                    Logga in
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 text-center text-sm"
                        onClick={() => setMobileOpen(false)}>
                    Skapa konto
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
