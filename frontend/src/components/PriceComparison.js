// ============================================
// PriceComparison — Store price comparison table
// Highlights the cheapest option
// ============================================

'use client';

import { Store, TrendingDown, Check } from 'lucide-react';

const STORE_COLORS = {
  ICA: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  Willys: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Coop: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Lidl: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

export function PriceComparison({ pricing, title }) {
  if (!pricing || pricing.length === 0) return null;

  const cheapest = pricing.reduce((min, s) => (s.price < min.price ? s : min));
  const mostExpensive = pricing.reduce((max, s) => (s.price > max.price ? s : max));
  const savings = mostExpensive.price - cheapest.price;

  return (
    <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-warm-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-50 flex items-center justify-center">
            <Store size={16} className="text-forest-400" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-warm-800">
              {title || 'Prisjämförelse'}
            </h4>
            <p className="text-xs text-warm-400">Totalpris för alla ingredienser</p>
          </div>
        </div>
        {savings > 0 && (
          <div className="flex items-center gap-1 bg-forest-50 text-forest-500 px-3 py-1 rounded-full text-xs font-bold">
            <TrendingDown size={12} />
            Spara {savings} kr
          </div>
        )}
      </div>

      {/* Store list */}
      <div className="divide-y divide-warm-100">
        {pricing
          .sort((a, b) => a.price - b.price)
          .map((store) => {
            const isCheapest = store.price === cheapest.price;
            const colors = STORE_COLORS[store.storeName] || {
              bg: 'bg-warm-50',
              text: 'text-warm-700',
              border: 'border-warm-200',
            };

            return (
              <div
                key={store.storeName}
                className={`flex items-center justify-between px-5 py-3.5 transition-colors
                  ${isCheapest ? 'bg-forest-50/30' : 'hover:bg-warm-50/50'}`}
              >
                <div className="flex items-center gap-3">
                  {/* Store badge */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.text}`}
                  >
                    {store.storeName}
                  </span>
                  {isCheapest && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-500">
                      <Check size={12} strokeWidth={3} />
                      Billigast
                    </span>
                  )}
                </div>

                <span
                  className={`text-base font-bold tabular-nums
                    ${isCheapest ? 'text-forest-500' : 'text-warm-600'}`}
                >
                  {store.price} kr
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
