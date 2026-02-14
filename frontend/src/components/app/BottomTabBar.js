// ============================================
// BottomTabBar — Pixel-perfect bottom navigation
// 80px height, teal center button, active tab has
// dark circle background behind icon
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Hem', icon: Home },
  { href: '/butiker', label: 'Sök', icon: Search },
  { href: '/ny', label: '', icon: PlusCircle, isCenter: true },
  { href: '/favoriter', label: 'Favoriter', icon: Heart },
  { href: '/installningar', label: 'Profil', icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  const handleTap = async () => {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {}
  };

  return (
    <nav
      className="app-tab-bar z-50"
      aria-label="Huvudnavigering"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2" style={{ height: '80px' }}>
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          if (tab.isCenter) {
            return (
              <Link
                key={`tab-${i}`}
                href={tab.href}
                onClick={handleTap}
                aria-label="Lägg till nytt"
                className="flex items-center justify-center flex-1 py-2"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex items-center justify-center -mt-5"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '9999px',
                    background: '#2ABFBF',
                    boxShadow: '0 4px 24px rgba(42,191,191,0.25)',
                  }}
                >
                  <Icon size={24} strokeWidth={1.5} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={`tab-${i}`}
              href={tab.href}
              onClick={handleTap}
              aria-label={tab.label}
              className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 relative"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative flex items-center justify-center"
                style={{ width: '40px', height: '40px' }}
              >
                {/* Active: dark circle background behind icon */}
                {active && (
                  <motion.div
                    layoutId="tab-active-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: '#1A1A2E' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  strokeWidth={1.8}
                  className="relative z-10"
                  style={{ color: active ? '#FFFFFF' : '#C7C7CC' }}
                />
              </motion.div>
              <span
                className="text-tiny leading-tight"
                style={{
                  color: active ? '#1A1A2E' : '#C7C7CC',
                  fontWeight: active ? '600' : '500',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
