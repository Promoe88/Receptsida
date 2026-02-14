// ============================================
// AppHome — Editorial / Magazine Home Feed
// Serif headlines, editorial cards, sticky search,
// pill chips, staggered framer-motion entry
// ============================================

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Star, Clock, Flame, Leaf,
  Users, Sparkles, Wine, Zap,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';

// ── Data ──

const HERO_RECIPE = {
  id: 'hero-1',
  title: 'Krämig Kycklingpasta',
  subtitle: 'med soltorkade tomater & parmesan',
  image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  rating: 4.8,
  time: 25,
  badge: 'Bästa pris',
};

const POPULAR_RECIPES = [
  {
    id: 'pop-1',
    title: 'Laxbowl med avokado 🥑',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    rating: 4.7,
    time: 20,
  },
  {
    id: 'pop-2',
    title: 'Tacos med guacamole 🌮',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    rating: 4.6,
    time: 30,
  },
  {
    id: 'pop-3',
    title: 'Pasta Carbonara 🍝',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
    rating: 4.9,
    time: 20,
  },
];

const CATEGORIES = [
  { id: 'snabbt', label: 'Snabbt', icon: Zap },
  { id: 'vegetariskt', label: 'Vegetariskt', icon: Leaf },
  { id: 'familj', label: 'Familj', icon: Users },
  { id: 'fest', label: 'Fest', icon: Sparkles },
  { id: 'helg', label: 'Helg', icon: Wine },
  { id: 'trending', label: 'Trending', icon: Flame },
];

// ── Animation variants ──

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Component ──

export function AppHome({ onStartSearch, onSelectPopularRecipe }) {
  const { user } = useAuthStore();
  const [activeChip, setActiveChip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'där';

  // Scroll detection for sticky search bar
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 80);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      onStartSearch?.(searchQuery.trim());
    } else {
      onStartSearch?.();
    }
  }, [searchQuery, onStartSearch]);

  const handleChipTap = useCallback((chipId) => {
    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Light });
    }).catch(() => {});
    setActiveChip((prev) => prev === chipId ? null : chipId);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
      style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
    >
      <motion.div
        className="pb-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ═══ HEADER — Serif greeting ═══ */}
        <motion.div variants={slideUp} className="px-6 pt-4 pb-2">
          <p className="font-body text-label text-warm-400 mb-0.5">
            Hej {firstName},
          </p>
          <h1 className="font-display text-[28px] font-bold text-warm-900 leading-tight tracking-tight">
            Vad lagar vi idag?
          </h1>
        </motion.div>

        {/* ═══ STICKY SEARCH HUD ═══ */}
        <motion.div
          variants={slideUp}
          className="px-6 pt-3 pb-1 sticky top-0 z-30 transition-all duration-300"
          style={{
            ...(isScrolled ? {
              background: 'rgba(245,245,247,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              paddingTop: '8px',
              paddingBottom: '8px',
            } : {}),
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div
              className="bg-white flex items-center gap-3 transition-all duration-300"
              style={{
                borderRadius: '9999px',
                padding: isScrolled ? '10px 18px' : '14px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Search
                size={isScrolled ? 18 : 20}
                className="text-warm-400 flex-shrink-0 transition-all duration-300"
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök recept, ingredienser..."
                className="flex-1 bg-transparent border-none outline-none text-warm-800
                         placeholder:text-warm-400 font-body transition-all duration-300"
                style={{ fontSize: isScrolled ? '14px' : '15px' }}
              />
              {searchQuery.trim() && (
                <motion.button
                  type="submit"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: '#111111' }}
                >
                  <ArrowRight size={16} className="text-white" strokeWidth={2.5} />
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ═══ CATEGORY CHIPS ═══ */}
        <motion.div variants={slideUp} className="px-6 pt-4 pb-2">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeChip === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChipTap(cat.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full
                           text-[13px] font-semibold whitespace-nowrap flex-shrink-0
                           transition-all duration-200"
                  style={{
                    background: active ? '#5A7D6C' : '#EBEBEB',
                    color: active ? '#FFFFFF' : '#48484A',
                  }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ HERO EDITORIAL CARD — Dagens Tips ═══ */}
        <motion.div variants={slideUp} className="px-6 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[18px] font-semibold text-warm-800">
              Dagens tips
            </h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPopularRecipe?.(HERO_RECIPE)}
            className="w-full relative overflow-hidden"
            style={{
              borderRadius: '32px',
              height: '280px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            }}
          >
            {/* Image */}
            <img
              src={HERO_RECIPE.image}
              alt={HERO_RECIPE.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Floating "Best Price" badge */}
            <div
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white"
              style={{
                background: '#D97757',
                boxShadow: '0 4px 12px rgba(217,119,87,0.35)',
              }}
            >
              {HERO_RECIPE.badge}
            </div>

            {/* Dark gradient overlay at bottom */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                height: '65%',
              }}
            >
              <h3 className="font-display text-[22px] font-bold text-white text-left leading-tight mb-1">
                {HERO_RECIPE.title}
              </h3>
              <p className="font-body text-[13px] text-white/70 text-left mb-3">
                {HERO_RECIPE.subtitle}
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-white/90 text-[12px] font-semibold">
                  <Star size={13} fill="#FFD60A" className="text-gold" />
                  {HERO_RECIPE.rating}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-white/90 text-[12px] font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                >
                  <Clock size={12} />
                  {HERO_RECIPE.time} min
                </span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ═══ POPULÄRA RECEPT ═══ */}
        <motion.div variants={slideUp} className="px-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] font-semibold text-warm-800">
              Populära recept
            </h2>
            <button className="font-body text-[13px] font-semibold" style={{ color: '#5A7D6C' }}>
              Visa alla
            </button>
          </div>

          <div className="space-y-4">
            {POPULAR_RECIPES.map((recipe, idx) => (
              <motion.button
                key={recipe.id}
                variants={slideUp}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPopularRecipe?.(recipe)}
                className="w-full bg-white flex items-center gap-4 p-3 text-left"
                style={{
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                }}
              >
                {/* Thumbnail */}
                <div
                  className="flex-shrink-0 overflow-hidden"
                  style={{ width: '80px', height: '80px', borderRadius: '20px' }}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-[15px] font-semibold text-warm-800 leading-snug mb-1.5 truncate">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-warm-500 text-[12px] font-medium">
                      <Star size={12} fill="#FFD60A" className="text-gold" />
                      {recipe.rating}
                    </span>
                    <span className="inline-flex items-center gap-1 text-warm-400 text-[12px] font-medium">
                      <Clock size={12} />
                      {recipe.time} min
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: '#F2F2F2' }}
                >
                  <ArrowRight size={16} className="text-warm-600" strokeWidth={2} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ═══ CTA — Ingredient Search ═══ */}
        <motion.div variants={slideUp} className="px-6 pt-7">
          <div
            className="bg-white p-6 flex flex-col items-center text-center"
            style={{
              borderRadius: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#EEF3F0' }}
            >
              <Sparkles size={24} style={{ color: '#5A7D6C' }} />
            </div>
            <h3 className="font-display text-[17px] font-semibold text-warm-800 mb-1">
              Vad har du i köket?
            </h3>
            <p className="font-body text-[13px] text-warm-400 mb-5 max-w-[240px]">
              Lägg till ingredienser och låt Nisse hitta det perfekta receptet
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onStartSearch?.()}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                       font-body font-semibold text-[14px] text-white"
              style={{
                background: '#111111',
                boxShadow: '0 4px 12px rgba(17,17,17,0.18)',
              }}
            >
              Börja nu <ArrowRight size={16} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
