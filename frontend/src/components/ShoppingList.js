// ============================================
// ShoppingList — Soft UI aggregated shopping list
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';

export function ShoppingList({ items }) {
  const [checked, setChecked] = useState(new Set());

  if (!items || items.length === 0) return null;

  const totalEst = items.reduce((sum, item) => {
    const match = (item.est_price || '').match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  function toggle(idx) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const allChecked = checked.size === items.length;

  return (
    <div className="card p-6 shadow-card">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-warm-800 tracking-tight flex items-center gap-2">
            <ShoppingBag size={22} className="text-sage-500" />
            Inköpslista
          </h3>
          <p className="text-sm text-warm-500 mt-1">
            {allChecked
              ? 'Allt inhandlat!'
              : `${items.length - checked.size} av ${items.length} varor kvar`}
          </p>
        </div>
        {totalEst > 0 && (
          <div className="bg-terra-50 border border-terra-200/50 px-4 py-2 rounded-2xl font-semibold text-terra-500 text-sm">
            ~{totalEst} kr
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {items.map((item, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => toggle(idx)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-left
                      border transition-all duration-150 group
                      ${checked.has(idx)
                        ? 'bg-cream-200/50 border-warm-200/40 opacity-50'
                        : 'bg-white border-warm-200 hover:border-sage-300 hover:shadow-soft'}`}
          >
            <span
              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                        transition-all duration-150
                ${checked.has(idx)
                  ? 'bg-sage-400 border-sage-400 text-white'
                  : 'border-warm-300 group-hover:border-sage-400'
                }`}
            >
              {checked.has(idx) && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="flex-1">
              <strong className="font-medium text-warm-800">{item.amount}</strong>{' '}
              <span className={checked.has(idx) ? 'line-through text-warm-400' : 'text-warm-600'}>{item.name}</span>
            </span>
            {item.est_price && (
              <span className="text-xs text-terra-400 font-semibold">{item.est_price}</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
