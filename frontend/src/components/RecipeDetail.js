// ============================================
// RecipeDetail — Bright warm recipe modal
// Soft UI, cooking + grocery launchers
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Users, ExternalLink,
  ShoppingCart, ListOrdered, Play, ShoppingBag, Check,
  Lightbulb, Wrench, Coins,
} from 'lucide-react';
import { CookingMode } from './CookingMode';
import { GroceryMode } from './GroceryMode';
import { getStepText } from '../data/recipes';

export function RecipeDetail({ recipe, onClose }) {
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showGroceryMode, setShowGroceryMode] = useState(false);
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

  if (showCookingMode) {
    return <CookingMode recipe={recipe} onClose={() => setShowCookingMode(false)} />;
  }

  return (
    <>
      <AnimatePresence>
        {showGroceryMode && (
          <GroceryMode recipe={recipe} onClose={() => setShowGroceryMode(false)} />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-warm-800/30 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl
                    overflow-hidden z-10 flex flex-col shadow-strong"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-warm-100
                        px-6 py-5 flex items-start justify-between z-10">
            <div className="flex-1 pr-4">
              <h2 className="font-display text-2xl sm:text-3xl text-warm-800">{recipe.title}</h2>
              {recipe.source_name && (
                <p className="text-sm text-warm-500 mt-1 flex items-center gap-1.5">
                  Källa:{' '}
                  {recipe.source_url ? (
                    <a href={recipe.source_url} target="_blank" rel="noopener noreferrer"
                      className="text-sage-500 font-medium hover:underline inline-flex items-center gap-1">
                      {recipe.source_name} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="font-medium">{recipe.source_name}</span>
                  )}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="badge-warm"><Clock size={12} /> {recipe.time_minutes || recipe.prepTime} min</span>
                <span className="badge-warm"><Users size={12} /> {recipe.servings} port</span>
                <span className="badge-sage">{recipe.difficulty}</span>
                {recipe.cost_estimate && (
                  <span className="badge-terra"><Coins size={12} /> {recipe.cost_estimate}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-cream-200 text-warm-400 hover:text-warm-700 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-6">
              {recipe.description && (
                <p className="text-warm-600 leading-relaxed text-sm">{recipe.description}</p>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCookingMode(true)}
                  className="btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  <Play size={16} /> Börja laga
                </button>
                <button
                  onClick={() => setShowGroceryMode(true)}
                  className="btn-outline flex items-center justify-center gap-2 py-3.5"
                >
                  <ShoppingBag size={16} /> Handla
                </button>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                    <ShoppingCart size={14} />
                  </span>
                  Ingredienser
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(recipe.ingredients || []).map((ing, idx) => (
                    <div key={idx}
                      className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm border
                        ${ing.have ? 'bg-cream-200 border-warm-200/60' : 'bg-sage-50/50 border-sage-200/40'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0
                        ${ing.have ? 'bg-sage-400' : 'bg-terra-400'}`} />
                      <span className="flex-1">
                        <strong className="font-medium text-warm-800">{ing.amount}</strong>{' '}
                        <span className="text-warm-600">{ing.name}</span>
                      </span>
                      {!ing.have && ing.est_price && (
                        <span className="text-xs text-terra-400 font-semibold">{ing.est_price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              {recipe.tools?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                      <Wrench size={14} />
                    </span>
                    Verktyg
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tools.map((tool, idx) => (
                      <span key={idx} className="bg-cream-200 text-warm-600 px-4 py-2 rounded-2xl text-sm font-medium">
                        {typeof tool === 'string' ? tool : tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                    <ListOrdered size={14} />
                  </span>
                  Gör så här
                </h3>
                <ol className="space-y-0 divide-y divide-warm-100">
                  {(recipe.steps || []).map((step, idx) => (
                    <li key={idx} className="flex gap-4 py-4">
                      <button
                        onClick={() => toggleStep(idx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                                  text-xs font-bold flex-shrink-0 mt-0.5 transition-all duration-200
                                  ${checkedSteps.has(idx)
                                    ? 'bg-sage-400 text-white'
                                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                                  }`}
                      >
                        {checkedSteps.has(idx) ? <Check size={12} strokeWidth={3} /> : idx + 1}
                      </button>
                      <p className={`text-sm leading-relaxed flex-1 transition-all duration-200
                        ${checkedSteps.has(idx) ? 'text-warm-400 line-through' : 'text-warm-700'}`}>
                        {getStepText(step)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {recipe.tips && (
                <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200/40 flex gap-3">
                  <Lightbulb size={18} className="text-sage-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warm-700">
                    <strong className="font-semibold text-sage-600">Tips:</strong> {recipe.tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
