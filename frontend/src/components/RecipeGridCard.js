// ============================================
// RecipeGridCard — Premium Bento Grid card
// Glassmorphism, verified badge, price trend
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Star, ShieldCheck, TrendingDown } from 'lucide-react';
import { getCheapestStore } from '../data/recipes';
import { PriceBadge } from './PriceBadge';

export function RecipeGridCard({ recipe, onClick, index = 0 }) {
  const cheapest = recipe.cheapestStore || getCheapestStore(recipe.pricing);

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick?.(recipe)}
      className="w-full text-left bg-white rounded-3xl border border-cream-100
               shadow-soft overflow-hidden group
               hover:shadow-strong hover:border-cream-200
               focus:outline-none focus:ring-2 focus:ring-action-400/20
               transition-shadow duration-300"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${recipe.matchScore >= 75
        ? 'bg-gradient-to-r from-pine-400 to-pine-300'
        : recipe.matchScore >= 50
          ? 'bg-gradient-to-r from-gold-400 to-gold-300'
          : 'bg-gradient-to-r from-cream-200 to-cream-100'
      }`} />

      <div className="p-5">
        {/* Top row — badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {recipe.verified && (
              <span className="inline-flex items-center gap-1 bg-pine-600 text-white
                           text-[10px] font-bold px-2 py-0.5 rounded-lg">
                <ShieldCheck size={10} /> Verifierad
              </span>
            )}
            {recipe.matchScore > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg
                ${recipe.matchScore >= 75
                  ? 'bg-pine-50 text-pine-600'
                  : recipe.matchScore >= 50
                    ? 'bg-gold-50 text-gold-600'
                    : 'bg-cream-100 text-cream-500'
                }`}>
                {recipe.matchScore}% match
              </span>
            )}
          </div>
          {recipe.rating && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gold-500 font-semibold">
              <Star size={11} fill="currentColor" /> {recipe.rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-cream-800 leading-tight mb-1.5
                     group-hover:text-pine-600 transition-colors duration-200">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-cream-500 leading-relaxed line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] text-cream-400 font-medium">
            <Clock size={11} /> {recipe.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-cream-400 font-medium">
            <Users size={11} /> {recipe.servings} port
          </span>
          <span className="text-[11px] text-cream-400 font-medium">
            {recipe.difficulty}
          </span>
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between pt-3 border-t border-cream-100">
          <PriceBadge pricing={recipe.pricing} priceTrends={recipe.priceTrends} />
          {cheapest && (
            <span className="text-[10px] text-cream-400">
              från {cheapest.price} kr
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
