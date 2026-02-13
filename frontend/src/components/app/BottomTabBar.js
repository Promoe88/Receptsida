// ============================================
// BottomTabBar — Design system §6.5
// 80px height, shadow (no border), teal center
// Active: black icon + teal dot, Inactive: #C7C7CC
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Hem', icon: Home },
  { href: '/butiker', label: 'Sök', icon: Search },
  { href: '/favoriter', label: '', icon: PlusCircle, isCenter: true },
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
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 relative"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  style={{ color: active ? '#1A1A2E' : '#C7C7CC' }}
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
              {active && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute rounded-full"
                  style={{
                    bottom: '4px',
                    width: '4px',
                    height: '4px',
                    background: '#2ABFBF',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
