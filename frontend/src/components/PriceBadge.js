// ============================================
// PriceBadge — Dark theme price + sparkline
// ============================================

'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

function Sparkline({ data, color = '#34D399', width = 48, height = 16 }) {
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
      <div className="price-accent">
        <TrendingDown size={12} />
        <span>{cheapest.price} kr</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 bg-surface-300 border border-zinc-800
                  rounded-xl px-3.5 py-2">
      <div className="text-right">
        <span className="text-sm font-bold text-accent-400 tabular-nums font-mono">{cheapest.price} kr</span>
        <span className="text-[10px] text-zinc-500 block">{cheapest.storeName}</span>
      </div>

      {priceTrends && priceTrends.length > 1 && (
        <Sparkline
          data={priceTrends}
          color={trendValue <= 0 ? '#34D399' : '#FF5C00'}
          width={40}
          height={14}
        />
      )}

      {trendValue !== 0 && (
        <div className={`flex items-center gap-0.5 text-[10px] font-bold font-mono
          ${trendValue < 0 ? 'text-emerald-400' : 'text-accent-400'}`}
        >
          {trendValue < 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
          <span>{Math.abs(trendValue)}%</span>
        </div>
      )}
    </div>
  );
}

export function PriceTrendCard({ ingredient, trend, weeklyChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-300">{ingredient}</span>
      <div className="flex items-center gap-2">
        {weeklyChange && (
          <span className={`text-[10px] font-bold font-mono
            ${weeklyChange < 0 ? 'text-emerald-400' : 'text-accent-400'}`}>
            {weeklyChange < 0 ? '' : '+'}{weeklyChange}%
          </span>
        )}
      </div>
    </div>
  );
}
