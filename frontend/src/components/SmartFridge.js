// ============================================
// SmartFridge — Dark theme ingredient selector
// ============================================

'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Refrigerator, ChefHat, Sparkles, X, Check } from 'lucide-react';
import { FRIDGE_INGREDIENTS, findCompleteMeals } from '../data/recipes';

const CATEGORIES = [
  { key: 'protein', label: 'Kött & Fisk' },
  { key: 'mejeri', label: 'Mejeri' },
  { key: 'grönsak', label: 'Grönt' },
  { key: 'kolhydrat', label: 'Kolhydrater' },
  { key: 'konserv', label: 'Skafferi' },
  { key: 'olja', label: 'Oljor' },
  { key: 'ört', label: 'Örter' },
  { key: 'krydda', label: 'Kryddor' },
  { key: 'frukt', label: 'Frukt' },
];

export function SmartFridge({ onMealsFound, onRecipeSelect }) {
  const [owned, setOwned] = useState(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = useCallback((id) => {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const meals = useMemo(() => {
    const ids = Array.from(owned);
    const found = findCompleteMeals(ids);
    onMealsFound?.(found);
    return found;
  }, [owned, onMealsFound]);

  const completeMeals = meals.filter((m) => m.matchScore >= 60);

  const groupedIngredients = useMemo(() => {
    const groups = {};
    for (const ing of FRIDGE_INGREDIENTS) {
      if (!groups[ing.category]) groups[ing.category] = [];
      groups[ing.category].push(ing);
    }
    return groups;
  }, []);

  return (
    <section className="card-dark overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-200/50
                 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center">
            <Refrigerator size={20} className="text-accent-400" />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-zinc-100 text-sm">Smart Kylskåp</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {owned.size === 0
                ? 'Markera vad du har hemma'
                : `${owned.size} ingredienser valda`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {completeMeals.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1.5 bg-accent-400 text-void
                       text-xs font-bold px-3 py-1.5 rounded-full shadow-glow-sm"
            >
              <ChefHat size={12} />
              {completeMeals.length} recept
            </motion.span>
          )}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-zinc-500"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.span>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              {owned.size > 0 && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => setOwned(new Set())}
                    className="text-xs text-zinc-500 hover:text-accent-400 transition-colors
                             flex items-center gap-1"
                  >
                    <X size={12} /> Rensa alla
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {CATEGORIES.filter((cat) => groupedIngredients[cat.key]).map((cat) => (
                  <div key={cat.key}>
                    <p className="label-sm mb-2">{cat.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {groupedIngredients[cat.key].map((ing) => {
                        const isOwned = owned.has(ing.id);
                        return (
                          <motion.button
                            key={ing.id}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => toggle(ing.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
                                      transition-all duration-200 border
                                      ${isOwned
                                        ? 'bg-accent-400/15 text-accent-300 border-accent-400/30 shadow-glow-sm'
                                        : 'bg-surface-300 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                                      }`}
                          >
                            {isOwned ? (
                              <Check size={13} strokeWidth={2.5} className="text-accent-400" />
                            ) : (
                              <span className="text-base leading-none">{ing.emoji}</span>
                            )}
                            <span className="font-medium">{ing.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {completeMeals.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-5 p-4 bg-accent-400/10 rounded-xl border border-accent-400/20"
                  >
                    <p className="text-xs font-semibold text-accent-400 flex items-center gap-1.5 mb-2">
                      <Sparkles size={13} />
                      Du kan laga nu:
                    </p>
                    <div className="space-y-1.5">
                      {completeMeals.slice(0, 3).map((meal) => (
                        <button
                          key={meal.id}
                          onClick={() => onRecipeSelect?.(meal)}
                          className="w-full flex items-center justify-between bg-surface rounded-xl
                                   px-3.5 py-2.5 text-sm hover:bg-surface-200 transition-all
                                   group text-left border border-zinc-800/60"
                        >
                          <span className="font-medium text-zinc-200 group-hover:text-accent-400 transition-colors">
                            {meal.title}
                          </span>
                          <span className="text-xs font-bold text-accent-400 font-mono">{meal.matchScore}%</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
