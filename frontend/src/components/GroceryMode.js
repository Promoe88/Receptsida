// ============================================
// GroceryMode — Shopping list grouped by aisle
// Premium shopping assistant view
// ============================================

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, X, MapPin, Store } from 'lucide-react';
import { groupByAisle, getCheapestStore } from '../data/recipes';

export function GroceryMode({ recipe, onClose }) {
  const [checked, setChecked] = useState(new Set());

  const aisleGroups = useMemo(
    () => groupByAisle(recipe.ingredients),
    [recipe.ingredients]
  );

  const cheapest = getCheapestStore(recipe.pricing);
  const totalItems = recipe.ingredients.length;
  const checkedCount = checked.size;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  function toggle(key) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-pine-800/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-cream-50 rounded-t-3xl sm:rounded-3xl
                  overflow-hidden z-10 flex flex-col"
      >
        {/* Header */}
        <div className="bg-pine-600 text-white px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} />
              <div>
                <h2 className="font-display text-xl">Inköpslista</h2>
                <p className="text-pine-200 text-xs mt-0.5">{recipe.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-medium text-pine-100 tabular-nums">
              {checkedCount}/{totalItems}
            </span>
          </div>

          {/* Store recommendation */}
          {cheapest && (
            <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <Store size={14} className="text-pine-200" />
              <span className="text-xs text-pine-100">
                Handla hos <strong className="text-white">{cheapest.storeName}</strong> — totalt{' '}
                <strong className="text-white">{cheapest.price} kr</strong>
              </span>
            </div>
          )}
        </div>

        {/* Aisle list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {aisleGroups.map((aisle) => (
            <div key={aisle.name}>
              {/* Aisle header */}
              <div className="flex items-center gap-2 mb-2.5">
                <MapPin size={13} className="text-cream-400" />
                <span className="section-label">{aisle.name}</span>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {aisle.items.map((item, idx) => {
                  const key = `${aisle.name}-${idx}`;
                  const isDone = checked.has(key);
                  return (
                    <motion.button
                      key={key}
                      layout
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left
                                transition-all duration-200 border
                                ${isDone
                                  ? 'bg-cream-100 border-cream-200 opacity-50'
                                  : 'bg-white border-cream-100 shadow-soft'
                                }`}
                    >
                      {/* Checkbox */}
                      <span className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center
                                      flex-shrink-0 transition-all duration-200
                        ${isDone
                          ? 'bg-pine-500 border-pine-500 text-white'
                          : 'border-cream-300'
                        }`}>
                        {isDone && <Check size={11} strokeWidth={3} />}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium transition-all
                          ${isDone ? 'line-through text-cream-400' : 'text-cream-800'}`}>
                          {item.name}
                        </span>
                      </div>

                      {/* Amount */}
                      <span className={`text-xs font-medium flex-shrink-0
                        ${isDone ? 'text-cream-300' : 'text-cream-500'}`}>
                        {item.amount}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom action */}
        {checkedCount === totalItems && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-cream-200 bg-white"
          >
            <button
              onClick={onClose}
              className="w-full btn-pine py-3.5 rounded-2xl font-semibold"
            >
              Allt inhandlat!
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
