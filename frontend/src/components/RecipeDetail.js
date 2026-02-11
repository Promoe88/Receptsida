// ============================================
// RecipeDetail — Dark theme recipe modal
// With cooking mode + grocery mode launchers
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Users, Star, ShieldCheck,
  ShoppingCart, ListOrdered, Play, ShoppingBag, Check,
} from 'lucide-react';
import { PriceComparison } from './PriceComparison';
import { CookingMode } from './CookingMode';
import { GroceryMode } from './GroceryMode';

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

  const stepText = (step) => (typeof step === 'string' ? step : step?.text || '');

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
          className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-t-2xl sm:rounded-2xl
                    overflow-hidden z-10 flex flex-col border border-zinc-800/60"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface/90 backdrop-blur-xl border-b border-zinc-800
                        px-6 py-4 flex items-start justify-between z-10">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1.5">
                {recipe.verified && (
                  <span className="badge-emerald text-[10px] py-0.5 px-2">
                    <ShieldCheck size={10} /> Verifierad
                  </span>
                )}
                {recipe.rating && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-accent-300 font-semibold font-mono">
                    <Star size={11} fill="currentColor" /> {recipe.rating}
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-zinc-50">{recipe.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-mono">
                  <Clock size={12} /> {recipe.prepTime} min
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-mono">
                  <Users size={12} /> {recipe.servings} port
                </span>
                <span className="text-xs text-zinc-600 font-mono">{recipe.difficulty}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-200 text-zinc-500 hover:text-zinc-300
                       transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
              {/* Description */}
              <p className="text-zinc-400 leading-relaxed font-light text-sm">
                {recipe.description}
              </p>

              {/* Match score */}
              {recipe.matchScore > 0 && (
                <div className="flex items-center gap-3 bg-accent-400/10 rounded-xl px-4 py-3 border border-accent-400/20">
                  <div className="w-12 h-12 rounded-xl bg-accent-400 text-void flex items-center justify-center
                               font-bold text-lg font-mono">
                    {recipe.matchScore}%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">Ingrediensmatchning</p>
                    <p className="text-xs text-zinc-500">{recipe.matchScore}% av ingredienserna har du hemma</p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCookingMode(true)}
                  className="flex items-center justify-center gap-2 bg-accent-400 text-void
                           py-3.5 rounded-xl font-semibold text-sm hover:bg-accent-300
                           transition-colors active:scale-[0.97] shadow-glow-sm"
                >
                  <Play size={16} />
                  Börja laga
                </button>
                <button
                  onClick={() => setShowGroceryMode(true)}
                  className="flex items-center justify-center gap-2 bg-surface-300 text-zinc-200
                           py-3.5 rounded-xl font-semibold text-sm border border-zinc-800
                           hover:border-zinc-600 transition-colors active:scale-[0.97]"
                >
                  <ShoppingBag size={16} />
                  Handla
                </button>
              </div>

              {/* Price comparison */}
              <PriceComparison pricing={recipe.pricing} title={recipe.title} />

              {/* Ingredients */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-zinc-200 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-accent-400/10 text-accent-400 flex items-center justify-center">
                    <ShoppingCart size={13} />
                  </span>
                  Ingredienser
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {recipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 bg-surface-300 rounded-xl px-3.5 py-2.5 text-sm
                               border border-zinc-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                      <span className="flex-1">
                        <strong className="font-medium text-zinc-200">{ing.amount}</strong>{' '}
                        <span className="text-zinc-400">{ing.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-zinc-200 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-accent-400/10 text-accent-400 flex items-center justify-center">
                    <ListOrdered size={13} />
                  </span>
                  Gör så här
                </h3>
                <ol className="space-y-0 divide-y divide-zinc-800/60">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-4 py-3.5">
                      <button
                        onClick={() => toggleStep(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center
                                  text-xs font-bold flex-shrink-0 mt-0.5 transition-all duration-200
                                  ${checkedSteps.has(idx)
                                    ? 'bg-emerald-500 text-void'
                                    : 'bg-accent-400 text-void hover:bg-accent-300'
                                  }`}
                      >
                        {checkedSteps.has(idx) ? <Check size={12} strokeWidth={3} /> : idx + 1}
                      </button>
                      <p className={`text-sm leading-relaxed flex-1 transition-all duration-200
                        ${checkedSteps.has(idx) ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                        {stepText(step)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
