// ============================================
// PriceBadge — Compact price comparison with sparkline
// Shows cheapest price + trend indicator
// ============================================

'use client';

import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

// Mini SVG sparkline
function Sparkline({ data, color = '#4A7C59', width = 48, height = 16 }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-sparkline"
        style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
      />
    </svg>
  );
}

export function PriceBadge({ pricing, priceTrends, compact = false }) {
  if (!pricing || pricing.length === 0) return null;

  const cheapest = pricing.reduce((min, s) => (s.price < min.price ? s : min));
  const trendValue = cheapest.trend || 0;

  if (compact) {
    return (
      <div className="price-badge">
        <TrendingDown size={12} />
        <span>{cheapest.price} kr</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 bg-white border border-cream-200
                  rounded-2xl px-3.5 py-2 shadow-soft">
      {/* Price */}
      <div className="text-right">
        <span className="text-sm font-bold text-pine-600 tabular-nums">{cheapest.price} kr</span>
        <span className="text-[10px] text-cream-400 block">{cheapest.storeName}</span>
      </div>

      {/* Sparkline */}
      {priceTrends && priceTrends.length > 1 && (
        <Sparkline
          data={priceTrends}
          color={trendValue <= 0 ? '#4A7C59' : '#E65F2B'}
          width={40}
          height={14}
        />
      )}

      {/* Trend indicator */}
      {trendValue !== 0 && (
        <div className={`flex items-center gap-0.5 text-[10px] font-bold
          ${trendValue < 0 ? 'text-pine-500' : 'text-action-400'}`}
        >
          {trendValue < 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
          <span>{Math.abs(trendValue)}%</span>
        </div>
      )}
    </div>
  );
}

// Full-width price comparison for recipe detail
export function PriceTrendCard({ ingredient, trend, weeklyChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-cream-700">{ingredient}</span>
      <div className="flex items-center gap-2">
        {weeklyChange && (
          <span className={`text-[10px] font-bold
            ${weeklyChange < 0 ? 'text-pine-500' : 'text-action-400'}`}>
            {weeklyChange < 0 ? '' : '+'}{weeklyChange}%
          </span>
        )}
      </div>
    </div>
  );
}
