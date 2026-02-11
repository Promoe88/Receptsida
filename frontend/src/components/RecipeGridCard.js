// ============================================
// RecipeGridCard — Compact card for Bento Grid
// Shows best price badge + match percentage
// ============================================

'use client';

import { useState } from 'react';
import { Clock, Users, TrendingDown, ChefHat, Tag } from 'lucide-react';
import { getCheapestStore } from '../data/recipes';

export function RecipeGridCard({ recipe, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const cheapest = recipe.cheapestStore || getCheapestStore(recipe.pricing);

  // Color based on match score
  function getMatchColor(score) {
    if (score >= 75) return 'bg-forest-50 text-forest-500 border-forest-200';
    if (score >= 50) return 'bg-gold-50 text-gold-500 border-gold-200';
    return 'bg-warm-50 text-warm-500 border-warm-200';
  }

  function getMatchLabel(score) {
    if (score >= 75) return 'Perfekt match';
    if (score >= 50) return 'Bra match';
    return 'Delvis match';
  }

  return (
    <button
      onClick={() => onClick?.(recipe)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full text-left bg-white rounded-2xl border border-warm-200
                 transition-all duration-300 overflow-hidden group
                 hover:shadow-medium hover:-translate-y-1 hover:border-warm-300
                 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400`}
    >
      {/* Top section — Colored accent based on match */}
      <div className="relative p-5 pb-4">
        {/* Match % badge — top right */}
        {recipe.matchScore > 0 && (
          <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-xl text-xs font-bold
                         border ${getMatchColor(recipe.matchScore)}`}>
            {recipe.matchScore}%
          </div>
        )}

        {/* Recipe icon placeholder */}
        <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center mb-4
                      group-hover:scale-105 transition-transform duration-300">
          <ChefHat size={22} className="text-brand-400" />
        </div>

        {/* Title & description */}
        <h3 className="font-display text-xl text-warm-800 mb-1.5 leading-tight">
          {recipe.title}
        </h3>
        <p className="text-sm text-warm-400 leading-relaxed line-clamp-2 font-light">
          {recipe.description}
        </p>
      </div>

      {/* Meta row */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 text-xs text-warm-400">
          <Clock size={12} />
          {recipe.prepTime} min
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-warm-400">
          <Users size={12} />
          {recipe.servings} port
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-warm-400">
          <Tag size={12} />
          {recipe.difficulty}
        </span>
      </div>

      {/* Bottom section — Price info */}
      <div className="border-t border-warm-100 px-5 py-3.5 bg-warm-50/50
                    flex items-center justify-between">
        {cheapest && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-forest-500">
              <TrendingDown size={14} />
              <span className="text-sm font-bold">{cheapest.price} kr</span>
            </div>
            <span className="text-xs text-warm-400">
              hos {cheapest.storeName}
            </span>
          </div>
        )}

        {recipe.matchScore > 0 && (
          <span className="text-xs text-warm-400 font-medium hidden sm:block">
            {getMatchLabel(recipe.matchScore)}
          </span>
        )}
      </div>
    </button>
  );
}
