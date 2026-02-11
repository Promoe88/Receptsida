// ============================================
// PriceComparison — Dark theme store comparison
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Store, TrendingDown, TrendingUp, Check } from 'lucide-react';

const STORE_STYLES = {
  ICA: { accent: 'bg-red-400', dot: 'bg-red-400' },
  Willys: { accent: 'bg-red-500', dot: 'bg-red-500' },
  Coop: { accent: 'bg-emerald-400', dot: 'bg-emerald-400' },
  Lidl: { accent: 'bg-blue-400', dot: 'bg-blue-400' },
};

function TrendIndicator({ value }) {
  if (!value || value === 0) return null;
  const isDown = value < 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold font-mono
      ${isDown ? 'text-emerald-400' : 'text-accent-400'}`}>
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
    <div className="card-dark overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent-400/10 flex items-center justify-center">
            <Store size={16} className="text-accent-400" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-zinc-100">Prisjämförelse</h4>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {title || 'Totalpris alla ingredienser'}
            </p>
          </div>
        </div>
        {savings > 0 && (
          <div className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold font-mono border border-emerald-500/20">
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
            accent: 'bg-zinc-500', dot: 'bg-zinc-500',
          };
          const barWidth = maxPrice > 0 ? (store.price / maxPrice) * 100 : 0;

          return (
            <motion.div
              key={store.storeName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-xl p-3 transition-colors border
                ${isCheapest
                  ? 'bg-accent-400/10 border-accent-400/20'
                  : 'bg-surface-300 border-zinc-800/60'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                  <span className="text-sm font-semibold text-zinc-200">{store.storeName}</span>
                  {isCheapest && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-accent-400">
                      <Check size={10} strokeWidth={3} /> Billigast
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TrendIndicator value={store.trend} />
                  <span className={`text-sm font-bold tabular-nums font-mono
                    ${isCheapest ? 'text-accent-400' : 'text-zinc-300'}`}>
                    {store.price} kr
                  </span>
                </div>
              </div>

              <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${isCheapest ? 'bg-accent-400' : 'bg-zinc-600'}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
