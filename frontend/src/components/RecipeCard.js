// ============================================
// RecipeCard — Glassmorphism recipe card
// Soft shadows, bold headers, pill badges
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, BarChart3, Users, Coins, ExternalLink,
  Heart, Check, ShoppingCart, Wrench, ListOrdered,
  Lightbulb, Play, ShoppingBag, ArrowRight,
} from 'lucide-react';
import { getStepText } from '../data/recipes';

const DIFFICULTY_COLORS = {
  Enkel: 'bg-sage-50 text-sage-600 border-sage-200/50',
  Medel: 'bg-terra-50 text-terra-500 border-terra-200/50',
  Avancerad: 'bg-terra-100 text-terra-600 border-terra-300/50',
};

export function RecipeCard({ recipe, onToggleFavorite, onSelect }) {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  function toggleIngredient(index) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function handleFavorite() {
    if (onToggleFavorite) {
      const saved = await onToggleFavorite(recipe.id);
      if (saved !== null) setIsFavorite(saved);
    }
  }

  return (
    <div className="card p-6 sm:p-8 shadow-card">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="flex-1">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-warm-800 tracking-tight">{recipe.title}</h3>

          {recipe.source_name && (
            <p className="text-sm text-warm-500 mt-1 flex items-center gap-1.5">
              Baserat på recept från{' '}
              {recipe.source_url ? (
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-500 font-medium hover:underline inline-flex items-center gap-1"
                >
                  {recipe.source_name} <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-medium">{recipe.source_name}</span>
              )}
            </p>
          )}

          {recipe.description && (
            <p className="text-sm text-warm-500 mt-2 line-clamp-2 leading-relaxed">{recipe.description}</p>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="badge-warm">
              <Clock size={13} /> {recipe.time_minutes} min
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border
              ${DIFFICULTY_COLORS[recipe.difficulty] || 'bg-cream-300 text-warm-600'}`}>
              <BarChart3 size={12} /> {recipe.difficulty}
            </span>
            <span className="badge-warm">
              <Users size={13} /> {recipe.servings} port
            </span>
            {recipe.cost_estimate && (
              <span className="badge-terra">
                <Coins size={13} /> {recipe.cost_estimate}
              </span>
            )}
          </div>
        </div>

        {onToggleFavorite && (
          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-2xl border-2 transition-all duration-200
              ${isFavorite
                ? 'border-terra-300 bg-terra-50 text-terra-500'
                : 'border-warm-200 text-warm-400 hover:border-terra-300 hover:text-terra-500'
              }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Action buttons */}
      {onSelect && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onSelect(recipe)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm text-white bg-warm-800 shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.97]"
          >
            Börja laga <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onSelect(recipe)}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Visa detaljer
          </button>
        </div>
      )}

      {/* Ingredients */}
      <Section icon={<ShoppingCart size={16} />} title="Ingredienser">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(recipe.ingredients || []).map((ing, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => toggleIngredient(idx)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-left
                        transition-all duration-150 group border
                ${ing.have
                  ? 'bg-cream-200 border-warm-200/60 hover:bg-cream-300'
                  : 'bg-sage-50/50 border-sage-200/40 hover:bg-sage-50'
                }
                ${checkedIngredients.has(idx) ? 'opacity-50' : ''}`}
            >
              <span
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                          transition-all duration-150
                  ${checkedIngredients.has(idx)
                    ? 'bg-sage-400 border-sage-400 text-white'
                    : 'border-warm-300 group-hover:border-sage-400'
                  }`}
              >
                {checkedIngredients.has(idx) && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <strong className="font-medium text-warm-800">{ing.amount}</strong>{' '}
                <span className="text-warm-600">{ing.name}</span>
              </span>
              {!ing.have && (
                <span className="text-xs text-terra-400 font-semibold">
                  {ing.est_price || 'Köp'}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Tools */}
      {recipe.tools?.length > 0 && (
        <Section icon={<Wrench size={16} />} title="Verktyg">
          <div className="flex flex-wrap gap-2">
            {recipe.tools.map((tool, idx) => (
              <span
                key={idx}
                className="bg-cream-200 text-warm-600 px-4 py-2 rounded-2xl text-sm font-medium"
              >
                {typeof tool === 'string' ? tool : tool.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Steps */}
      <Section icon={<ListOrdered size={16} />} title="Gör så här">
        <ol className="space-y-0 divide-y divide-warm-100">
          {(recipe.steps || []).map((step, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex gap-4 py-4"
            >
              <span className="w-8 h-8 bg-sage-400 text-white rounded-full flex items-center justify-center
                             text-xs font-bold flex-shrink-0 mt-0.5 shadow-teal-glow">
                {idx + 1}
              </span>
              <p className="text-sm text-warm-700 leading-relaxed flex-1">
                {getStepText(step)}
              </p>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* Tips */}
      {recipe.tips && (
        <div className="mt-6 p-4 bg-sage-50 rounded-2xl border border-sage-200/40 flex gap-3">
          <Lightbulb size={18} className="text-sage-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warm-700">
            <strong className="font-semibold text-sage-600">Tips:</strong> {recipe.tips}
          </p>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="mt-6">
      <h4 className="flex items-center gap-2.5 font-semibold text-sm text-warm-800 mb-3">
        <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}
