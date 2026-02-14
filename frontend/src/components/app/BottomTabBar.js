// ============================================
// BottomTabBar — Floating glassmorphism nav
// 24px blur, Lucide 1.5px stroke, Sage Green
// active icon with 4px dot underneath
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

const SAGE_GREEN = '#5A7D6C';

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
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 -1px 0 rgba(0,0,0,0.04), 0 -8px 32px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-3" style={{ height: '72px' }}>
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          // ── Center "plus" button ──
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
                  className="flex items-center justify-center -mt-4"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '9999px',
                    background: '#111111',
                    boxShadow: '0 6px 20px rgba(17,17,17,0.25)',
                  }}
                >
                  <Icon size={22} strokeWidth={1.5} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          // ── Regular tabs ──
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
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: active ? SAGE_GREEN : '#C7C7CC' }}
                />
              </motion.div>

              <span
                className="text-[10px] leading-tight font-body"
                style={{
                  color: active ? SAGE_GREEN : '#C7C7CC',
                  fontWeight: active ? '600' : '400',
                  letterSpacing: '0.3px',
                }}
              >
                {tab.label}
              </span>

              {/* Active dot indicator */}
              {active && (
                <motion.div
                  layoutId="tab-active-dot"
                  className="absolute rounded-full"
                  style={{
                    bottom: '2px',
                    width: '4px',
                    height: '4px',
                    background: SAGE_GREEN,
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
