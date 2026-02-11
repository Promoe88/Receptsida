// ============================================
// RecipeCard — Dark theme full recipe display
// ============================================

'use client';

import { useState } from 'react';
import {
  Clock, BarChart3, Users, Coins, ExternalLink,
  Heart, Check, ShoppingCart, Wrench, ListOrdered,
  Lightbulb,
} from 'lucide-react';

export function RecipeCard({ recipe, onToggleFavorite }) {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  function toggleIngredient(index) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function handleFavorite() {
    if (onToggleFavorite) {
      const saved = await onToggleFavorite(recipe.id);
      if (saved !== null) setIsFavorite(saved);
    }
  }

  return (
    <div className="card-dark p-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="flex-1">
          <h3 className="font-display text-2xl text-zinc-100">{recipe.title}</h3>

          {recipe.source_name && (
            <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1.5">
              Baserat på recept från{' '}
              {recipe.source_url ? (
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-400 font-medium hover:underline inline-flex items-center gap-1"
                >
                  {recipe.source_name} <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-medium">{recipe.source_name}</span>
              )}
            </p>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="badge-surface">
              <Clock size={13} /> {recipe.time_minutes} min
            </span>
            <span className="badge-surface">
              <BarChart3 size={13} /> {recipe.difficulty}
            </span>
            <span className="badge-surface">
              <Users size={13} /> {recipe.servings} port
            </span>
            {recipe.cost_estimate && (
              <span className="badge-accent">
                <Coins size={13} /> {recipe.cost_estimate}
              </span>
            )}
          </div>
        </div>

        {onToggleFavorite && (
          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-xl border-2 transition-all duration-200
              ${isFavorite
                ? 'border-red-400/30 bg-red-400/10 text-red-400'
                : 'border-zinc-800 text-zinc-500 hover:border-red-400/30 hover:text-red-400'
              }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Ingredients */}
      <Section icon={<ShoppingCart size={16} />} title="Ingredienser" color="accent">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients.map((ing, idx) => (
            <button
              key={idx}
              onClick={() => toggleIngredient(idx)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-left
                        transition-all duration-150 group border
                ${ing.have
                  ? 'bg-surface-300 border-zinc-800/60 hover:bg-surface-200'
                  : 'bg-accent-400/5 border-accent-400/15 hover:bg-accent-400/10'
                }
                ${checkedIngredients.has(idx) ? 'opacity-50' : ''}`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                          transition-all duration-150
                  ${checkedIngredients.has(idx)
                    ? 'bg-accent-400 border-accent-400 text-void'
                    : 'border-zinc-600 group-hover:border-zinc-500'
                  }`}
              >
                {checkedIngredients.has(idx) && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <strong className="font-medium text-zinc-200">{ing.amount}</strong>{' '}
                <span className="text-zinc-400">{ing.name}</span>
              </span>
              {!ing.have && (
                <span className="text-xs text-accent-400 font-medium font-mono">köp</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section icon={<Wrench size={16} />} title="Verktyg som behövs" color="surface">
        <div className="flex flex-wrap gap-2">
          {recipe.tools.map((tool, idx) => (
            <span
              key={idx}
              className="bg-surface-300 text-zinc-300 px-3.5 py-1.5 rounded-lg text-sm font-medium
                       border border-zinc-800/60"
            >
              {typeof tool === 'string' ? tool : tool.name}
            </span>
          ))}
        </div>
      </Section>

      {/* Steps */}
      <Section icon={<ListOrdered size={16} />} title="Tillvägagångssätt" color="accent">
        <ol className="space-y-0 divide-y divide-zinc-800/60">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 py-3.5">
              <span
                className="w-7 h-7 bg-accent-400 text-void rounded-full flex items-center justify-center
                         text-xs font-bold flex-shrink-0 mt-0.5"
              >
                {idx + 1}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                {typeof step === 'string' ? step : step.content}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Tips */}
      {recipe.tips && (
        <div className="mt-5 p-4 bg-accent-400/10 rounded-xl border border-accent-400/15 flex gap-3">
          <Lightbulb size={18} className="text-accent-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-300">
            <strong className="font-semibold text-accent-400">Tips:</strong> {recipe.tips}
          </p>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, color, children }) {
  return (
    <div className="mt-6">
      <h4 className="flex items-center gap-2.5 font-semibold text-sm text-zinc-200 mb-3">
        <span className="w-7 h-7 rounded-lg bg-accent-400/10 text-accent-400 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}
