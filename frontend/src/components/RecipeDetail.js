// ============================================
// RecipeDetail — Expanded recipe view (modal/overlay)
// ============================================

'use client';

import { useState } from 'react';
import {
  X, Clock, Users, Tag, ChefHat,
  Check, ShoppingCart, ListOrdered,
} from 'lucide-react';
import { PriceComparison } from './PriceComparison';

export function RecipeDetail({ recipe, onClose }) {
  const [checkedSteps, setCheckedSteps] = useState(new Set());

  if (!recipe) return null;

  function toggleStep(idx) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-warm-800/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl
                    overflow-y-auto shadow-strong animate-fade-up z-10 mx-0 sm:mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-warm-100
                      px-6 py-4 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <h2 className="font-display text-2xl text-warm-800">{recipe.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-warm-400">
                <Clock size={12} /> {recipe.prepTime} min
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-warm-400">
                <Users size={12} /> {recipe.servings} portioner
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-warm-400">
                <Tag size={12} /> {recipe.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-600
                     transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <p className="text-warm-500 leading-relaxed font-light">
            {recipe.description}
          </p>

          {/* Match score */}
          {recipe.matchScore > 0 && (
            <div className="flex items-center gap-3 bg-brand-50/50 rounded-2xl px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-brand-400 text-white flex items-center justify-center font-bold text-lg">
                {recipe.matchScore}%
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">Matchning</p>
                <p className="text-xs text-warm-400">av ingredienserna har du redan hemma</p>
              </div>
            </div>
          )}

          {/* Price comparison */}
          <PriceComparison pricing={recipe.pricing} title={`Prisjämförelse — ${recipe.title}`} />

          {/* Ingredients */}
          <div>
            <h3 className="flex items-center gap-2.5 font-semibold text-sm text-warm-700 mb-3">
              <span className="w-7 h-7 rounded-lg bg-forest-50 text-forest-400 flex items-center justify-center">
                <ShoppingCart size={14} />
              </span>
              Ingredienser
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-warm-50 rounded-xl px-3.5 py-2.5 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                  <span>
                    <strong className="font-medium text-warm-800">{ing.amount}</strong>{' '}
                    <span className="text-warm-600">{ing.name}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="flex items-center gap-2.5 font-semibold text-sm text-warm-700 mb-3">
              <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-400 flex items-center justify-center">
                <ListOrdered size={14} />
              </span>
              Gör så här
            </h3>
            <ol className="space-y-0 divide-y divide-warm-100">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4 py-3.5">
                  <button
                    onClick={() => toggleStep(idx)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center
                              text-xs font-bold flex-shrink-0 mt-0.5 transition-all duration-200
                              ${checkedSteps.has(idx)
                                ? 'bg-forest-400 text-white'
                                : 'bg-brand-400 text-white hover:bg-brand-500'
                              }`}
                  >
                    {checkedSteps.has(idx) ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </button>
                  <p className={`text-sm leading-relaxed flex-1 transition-opacity duration-200
                    ${checkedSteps.has(idx) ? 'text-warm-400 line-through' : 'text-warm-700'}`}>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
