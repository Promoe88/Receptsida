// ============================================
// DailyRecommendation — Premium hero card
// Glassmorphism overlay, daily rotating recipe
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
      className="relative overflow-hidden rounded-3xl bg-pine-600 min-h-[340px] sm:min-h-[400px]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pine-700 via-pine-600 to-pine-500" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-action-400/10 rounded-full" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between h-full min-h-[340px] sm:min-h-[400px]">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="section-label text-pine-200">Dagens rekommendation</span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3 leading-[1.1]"
            >
              {recipe.title}
            </motion.h1>
          </div>

          {/* Price badge */}
          {cheapest && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex-shrink-0 bg-action-400 text-white px-4 py-2.5 rounded-2xl
                       shadow-price text-center"
            >
              <span className="text-2xl font-bold block leading-none">{cheapest.price} kr</span>
              <span className="text-[10px] font-medium text-action-100 mt-0.5 block">
                hos {cheapest.storeName}
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom content */}
        <div className="mt-auto pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-pine-100 text-sm sm:text-base leading-relaxed max-w-lg font-light"
          >
            {recipe.description}
          </motion.p>

          <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
            {/* Meta badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs text-pine-200 bg-white/10 px-3 py-1.5 rounded-xl">
                <Clock size={13} /> {recipe.prepTime} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-pine-200 bg-white/10 px-3 py-1.5 rounded-xl">
                <Users size={13} /> {recipe.servings} port
              </span>
              {recipe.rating && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gold-300 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Star size={13} fill="currentColor" /> {recipe.rating}
                </span>
              )}
              {recipe.verified && (
                <span className="inline-flex items-center gap-1.5 text-xs text-white bg-white/15 px-3 py-1.5 rounded-xl">
                  <ShieldCheck size={13} /> Verifierad
                </span>
              )}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect?.(recipe)}
              className="inline-flex items-center gap-2 bg-white text-pine-600 px-5 py-2.5
                       rounded-2xl text-sm font-semibold hover:bg-cream-50
                       transition-colors shadow-md"
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
