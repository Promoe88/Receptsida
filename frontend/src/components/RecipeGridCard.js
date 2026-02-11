// ============================================
// RecipeGridCard — Dark intelligence card
// Accent bar, sparklines, REA badge
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Star, ShieldCheck, TrendingDown } from 'lucide-react';
import { getCheapestStore } from '../data/recipes';
import { PriceBadge } from './PriceBadge';

export function RecipeGridCard({ recipe, onClick, index = 0 }) {
  const cheapest = recipe.cheapestStore || getCheapestStore(recipe.pricing);
  const bestTrend = recipe.pricing
    ? Math.min(...recipe.pricing.map((p) => p.trend || 0))
    : 0;
  const isOnSale = bestTrend <= -5;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick?.(recipe)}
      className="w-full text-left bg-surface rounded-2xl border border-zinc-800/60
               shadow-inner-glow overflow-hidden group
               hover:border-zinc-700 hover:bg-surface-200
               focus:outline-none focus:ring-1 focus:ring-accent-400/30
               transition-all duration-300"
    >
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${recipe.matchScore >= 75
        ? 'bg-gradient-to-r from-accent-400 to-accent-300'
        : recipe.matchScore >= 50
          ? 'bg-gradient-to-r from-accent-400/60 to-accent-400/30'
          : 'bg-gradient-to-r from-zinc-700 to-zinc-800'
      }`} />

      <div className="p-5">
        {/* Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {recipe.verified && (
              <span className="badge-emerald">
                <ShieldCheck size={10} /> Verifierad
              </span>
            )}
            {isOnSale && (
              <span className="badge-accent">
                <TrendingDown size={10} /> REA
              </span>
            )}
            {recipe.matchScore > 0 && (
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border
                ${recipe.matchScore >= 75
                  ? 'bg-accent-400/15 text-accent-400 border-accent-400/20'
                  : recipe.matchScore >= 50
                    ? 'bg-accent-400/10 text-accent-400/70 border-accent-400/15'
                    : 'bg-surface-50 text-zinc-500 border-zinc-800'
                }`}>
                {recipe.matchScore}% match
              </span>
            )}
          </div>
          {recipe.rating && (
            <span className="inline-flex items-center gap-1 text-[11px] text-accent-300 font-semibold font-mono">
              <Star size={11} fill="currentColor" /> {recipe.rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-zinc-100 leading-tight mb-1.5
                     group-hover:text-accent-400 transition-colors duration-200">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            <Clock size={11} className="text-zinc-600" /> {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
            <Users size={11} className="text-zinc-600" /> {recipe.servings} port
          </span>
          <span className="text-[11px] text-zinc-600 font-mono">
            {recipe.difficulty}
          </span>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
          <PriceBadge pricing={recipe.pricing} priceTrends={recipe.priceTrends} />
          {cheapest && (
            <span className="text-[10px] text-zinc-600 font-mono">
              från {cheapest.price} kr
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
