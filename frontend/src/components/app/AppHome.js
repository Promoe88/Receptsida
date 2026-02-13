// ============================================
// AppHome — Pixel-perfect home screen
// Header with grid icon + MatKompass + avatar
// CTA banner card + Popular recipes section
// ============================================

'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Star, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

const POPULAR_RECIPES = [
  {
    id: 1,
    title: 'Krämig Kycklingpasta 🍝',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    rating: 4.5,
    time: 25,
  },
  {
    id: 2,
    title: 'Laxbowl med avokado 🥑',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    rating: 4.8,
    time: 20,
  },
  {
    id: 3,
    title: 'Tacos med guacamole 🌮',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    rating: 4.6,
    time: 30,
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function AppHome({ onStartSearch, onSelectPopularRecipe }) {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <motion.div
      className="px-5 pt-5 pb-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Header bar ── */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-7">
        <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <LayoutGrid size={20} className="text-warm-700" strokeWidth={1.8} />
        </button>

        <h1 className="font-display text-heading font-bold text-warm-800 tracking-tight">
          MatKompass
        </h1>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-caption font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #2ABFBF, #22A8A8)' }}
        >
          {initials}
        </div>
      </motion.div>

      {/* ── CTA Banner ── */}
      <motion.div variants={fadeUp} className="mb-7">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-display text-[17px] font-bold text-warm-800 leading-snug mb-1">
            Hitta recept baserat på vad du har hemma
          </h2>
          <p className="text-label text-warm-400 mb-4">
            Lägg till ingredienser och låt Nisse hitta det perfekta receptet
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStartSearch}
            className="inline-flex items-center gap-2 bg-warm-800 text-white px-6 py-3 rounded-full
                     font-medium text-label shadow-btn"
          >
            Börja nu <ArrowRight size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Popular recipes ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[17px] font-bold text-warm-800">Populära recept</h2>
          <button className="text-label font-semibold text-sage-400">Visa alla</button>
        </div>

        <div className="space-y-4">
          {POPULAR_RECIPES.map((recipe) => (
            <motion.button
              key={recipe.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPopularRecipe?.(recipe)}
              className="w-full relative rounded-2xl overflow-hidden shadow-card"
              style={{ height: '200px' }}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-x-0 bottom-0 p-4 flex items-end"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.0) 100%)',
                  height: '60%',
                }}
              >
                <div className="w-full">
                  <h3 className="text-white font-bold text-[16px] text-left mb-2 leading-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-white/90 text-caption font-semibold">
                      <Star size={13} fill="#FFD60A" className="text-gold" />
                      {recipe.rating}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-caption font-medium px-2.5 py-1 rounded-full">
                      <Clock size={12} />
                      {recipe.time} min
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
