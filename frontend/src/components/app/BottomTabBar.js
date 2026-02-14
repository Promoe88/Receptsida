// ============================================
// BottomTabBar — Ultra-discreet floating nav
// Minimal footprint, subtle glass, keeps 100%
// focus on the Decision Engine prompt above
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
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -1px 0 rgba(0,0,0,0.03)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-4" style={{ height: '56px' }}>
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          // ── Center "plus" button — smaller, subtler ──
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
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '9999px',
                    background: '#111111',
                    boxShadow: '0 4px 12px rgba(17,17,17,0.15)',
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          // ── Regular tabs — minimal ──
          return (
            <Link
              key={`tab-${i}`}
              href={tab.href}
              onClick={handleTap}
              aria-label={tab.label}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: active ? '#48484A' : '#C7C7CC' }}
                />
              </motion.div>

              <span
                className="text-[9px] leading-tight font-body"
                style={{
                  color: active ? '#48484A' : '#C7C7CC',
                  fontWeight: active ? '500' : '400',
                  letterSpacing: '0.3px',
                }}
              >
                {tab.label}
              </span>

              {/* Subtle active dot */}
              {active && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute rounded-full"
                  style={{
                    bottom: '4px',
                    width: '3px',
                    height: '3px',
                    background: '#48484A',
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
