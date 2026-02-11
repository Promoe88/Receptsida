// ============================================
// DailyRecommendation — Dark hero card
// Grid decoration + accent glow
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { getCheapestStore } from '../data/recipes';

export function DailyRecommendation({ recipe, onSelect }) {
  if (!recipe) return null;

  const cheapest = getCheapestStore(recipe.pricing);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-surface-200 min-h-[340px] sm:min-h-[400px]
                border border-zinc-800/60"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-300 via-surface to-void" />

      {/* Grid lines decoration */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-400/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent-400/3 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between h-full min-h-[340px] sm:min-h-[400px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="label-sm text-accent-400">Dagens rekommendation</span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-display-sm sm:text-display-md lg:text-display-lg text-zinc-50 mt-3"
            >
              {recipe.title}
            </motion.h1>
          </div>

          {cheapest && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex-shrink-0 bg-accent-400 text-void px-4 py-2.5 rounded-xl
                       shadow-glow text-center"
            >
              <span className="text-2xl font-bold block leading-none font-mono">{cheapest.price} kr</span>
              <span className="text-[10px] font-medium text-accent-900 mt-0.5 block">
                hos {cheapest.storeName}
              </span>
            </motion.div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg font-light"
          >
            {recipe.description}
          </motion.p>

          <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-surface-50/10 px-3 py-1.5 rounded-lg font-mono">
                <Clock size={13} /> {recipe.prepTime} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-surface-50/10 px-3 py-1.5 rounded-lg font-mono">
                <Users size={13} /> {recipe.servings} port
              </span>
              {recipe.rating && (
                <span className="inline-flex items-center gap-1.5 text-xs text-accent-300 bg-accent-400/10 px-3 py-1.5 rounded-lg font-mono">
                  <Star size={13} fill="currentColor" /> {recipe.rating}
                </span>
              )}
              {recipe.verified && (
                <span className="badge-emerald">
                  <ShieldCheck size={13} /> Verifierad
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect?.(recipe)}
              className="btn-accent inline-flex items-center gap-2"
            >
              Visa recept
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
