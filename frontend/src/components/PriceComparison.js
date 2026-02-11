// ============================================
// PriceComparison — Premium store price comparison
// With trend indicators and glassmorphism
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Store, TrendingDown, TrendingUp, Check, Minus } from 'lucide-react';

const STORE_STYLES = {
  ICA: { accent: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  Willys: { accent: 'bg-red-600', bg: 'bg-red-50', text: 'text-red-800' },
  Coop: { accent: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  Lidl: { accent: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
};

function TrendIndicator({ value }) {
  if (!value || value === 0) return null;
  const isDown = value < 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold
      ${isDown ? 'text-pine-500' : 'text-action-400'}`}>
      {isDown ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
      {Math.abs(value)}%
    </span>
  );
}

export function PriceComparison({ pricing, title }) {
  if (!pricing || pricing.length === 0) return null;

  const sorted = [...pricing].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const savings = mostExpensive.price - cheapest.price;
  const maxPrice = mostExpensive.price;

  return (
    <div className="bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-pine-50 flex items-center justify-center">
            <Store size={16} className="text-pine-500" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-cream-800">Prisjämförelse</h4>
            <p className="text-[10px] text-cream-400 mt-0.5">
              {title || 'Totalpris alla ingredienser'}
            </p>
          </div>
        </div>
        {savings > 0 && (
          <div className="flex items-center gap-1 bg-pine-50 text-pine-600 px-3 py-1.5 rounded-xl text-xs font-bold">
            <TrendingDown size={12} />
            Spara {savings} kr
          </div>
        )}
      </div>

      {/* Store bars */}
      <div className="px-5 pb-5 space-y-2.5">
        {sorted.map((store, idx) => {
          const isCheapest = store.price === cheapest.price;
          const styles = STORE_STYLES[store.storeName] || {
            accent: 'bg-cream-400', bg: 'bg-cream-50', text: 'text-cream-700',
          };
          const barWidth = maxPrice > 0 ? (store.price / maxPrice) * 100 : 0;

          return (
            <motion.div
              key={store.storeName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-2xl p-3 transition-colors
                ${isCheapest ? 'bg-pine-50 ring-1 ring-pine-200' : 'bg-cream-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Store dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${styles.accent}`} />
                  <span className="text-sm font-semibold text-cream-800">{store.storeName}</span>
                  {isCheapest && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-pine-600">
                      <Check size={10} strokeWidth={3} /> Billigast
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TrendIndicator value={store.trend} />
                  <span className={`text-sm font-bold tabular-nums
                    ${isCheapest ? 'text-pine-600' : 'text-cream-700'}`}>
                    {store.price} kr
                  </span>
                </div>
              </div>

              {/* Price bar */}
              <div className="h-1.5 bg-cream-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${isCheapest ? 'bg-pine-400' : 'bg-cream-300'}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
