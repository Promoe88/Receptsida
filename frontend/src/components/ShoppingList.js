// ============================================
// ShoppingList — Dark theme aggregated shopping list
// ============================================

'use client';

import { useState } from 'react';
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
    <div className="card-dark border-accent-400/15 p-6">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h3 className="font-display text-xl text-zinc-100 flex items-center gap-2">
            <ShoppingBag size={22} className="text-accent-400" />
            Inköpslista
          </h3>
          <p className="text-sm text-zinc-500 mt-1">
            {allChecked
              ? 'Allt inhandlat!'
              : `${items.length - checked.size} av ${items.length} varor kvar`}
          </p>
        </div>
        {totalEst > 0 && (
          <div className="bg-accent-400/10 border border-accent-400/20 px-4 py-2 rounded-xl font-semibold text-accent-400 text-sm font-mono">
            ~{totalEst} kr
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left
                      bg-surface-300 border border-zinc-800/60 transition-all duration-150 group
                      ${checked.has(idx) ? 'opacity-40' : 'hover:border-zinc-700'}`}
          >
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                        transition-all duration-150
                ${checked.has(idx)
                  ? 'bg-accent-400 border-accent-400 text-void'
                  : 'border-zinc-600 group-hover:border-zinc-500'
                }`}
            >
              {checked.has(idx) && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="flex-1">
              <strong className="font-medium text-zinc-200">{item.amount}</strong>{' '}
              <span className={checked.has(idx) ? 'line-through text-zinc-600' : 'text-zinc-400'}>{item.name}</span>
            </span>
            {item.est_price && (
              <span className="text-xs text-accent-400 font-medium font-mono">{item.est_price}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
