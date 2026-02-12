// ============================================
// BottomTabBar — iOS-style tab navigation
// ============================================

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Heart, MapPin, Clock, Settings } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Sök', icon: Search },
  { href: '/favoriter', label: 'Favoriter', icon: Heart },
  { href: '/butiker', label: 'Butiker', icon: MapPin },
  { href: '/historik', label: 'Historik', icon: Clock },
  { href: '/installningar', label: 'Mer', icon: Settings },
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
                    bg-cream/95 backdrop-blur-xl border-t border-warm-200/60 safe-bottom">
      <div className="flex items-center justify-around h-14 px-1">
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
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5
                rounded-xl transition-colors duration-200
                ${active ? 'text-sage-500' : 'text-warm-400 active:text-warm-600'}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] leading-tight
                ${active ? 'font-semibold text-sage-600' : 'font-medium text-warm-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
