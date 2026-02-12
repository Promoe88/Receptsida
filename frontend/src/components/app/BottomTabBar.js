// ============================================
// BottomTabBar — iOS-style 4-tab navigation
// Search, Heart (Favorites), Map (Stores), User (Settings)
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Heart, MapPin, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Sök', icon: Search },
  { href: '/favoriter', label: 'Favoriter', icon: Heart },
  { href: '/butiker', label: 'Butiker', icon: MapPin },
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
    <nav className="app-tab-bar fixed bottom-0 left-0 right-0 z-50
                    bg-white/95 backdrop-blur-xl border-t border-warm-200/60 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
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
                ${active ? 'font-semibold text-sage-500' : 'font-medium text-warm-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
