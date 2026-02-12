// ============================================
// BottomTabBar — Glassmorphism tab navigation
// Soft UI with frosted glass effect
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
    <nav className="app-tab-bar z-50 border-t border-warm-200/40"
         style={{
           background: 'rgba(255, 255, 255, 0.80)',
           backdropFilter: 'blur(24px)',
           WebkitBackdropFilter: 'blur(24px)',
         }}>
      <div className="flex items-center justify-around h-16 px-2">
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
                className="flex items-center justify-center flex-1 py-2"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-sage-glow -mt-5"
                  style={{ backgroundColor: '#1A1A2E' }}
                >
                  <Icon size={24} strokeWidth={2} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={`tab-${i}`}
              href={tab.href}
              onClick={handleTap}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 relative"
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-sage-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-sage-400' : 'text-warm-400'}
                />
              </motion.div>
              <span className={`text-[10px] leading-tight
                ${active ? 'font-bold text-sage-500' : 'font-medium text-warm-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
