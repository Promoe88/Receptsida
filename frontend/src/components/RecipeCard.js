// ============================================
// RecipeCard — Full recipe display
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
    <div className="card recipe-card-hover">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="flex-1">
          <h3 className="font-display text-2xl text-warm-800">{recipe.title}</h3>

          {recipe.source_name && (
            <p className="text-sm text-warm-400 mt-1 flex items-center gap-1.5">
              📄 Baserat på recept från{' '}
              {recipe.source_url ? (
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 font-medium hover:underline inline-flex items-center gap-1"
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
            <span className="badge bg-warm-50 text-warm-600">
              <Clock size={13} /> {recipe.time_minutes} min
            </span>
            <span className="badge bg-warm-50 text-warm-600">
              <BarChart3 size={13} /> {recipe.difficulty}
            </span>
            <span className="badge bg-warm-50 text-warm-600">
              <Users size={13} /> {recipe.servings} port
            </span>
            {recipe.cost_estimate && (
              <span className="badge bg-gold-50 text-gold-500">
                <Coins size={13} /> {recipe.cost_estimate}
              </span>
            )}
          </div>
        </div>

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-xl border-2 transition-all duration-200
              ${isFavorite
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-warm-200 text-warm-400 hover:border-red-200 hover:text-red-400'
              }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Ingredients */}
      <Section icon={<ShoppingCart size={16} />} title="Ingredienser" color="forest">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients.map((ing, idx) => (
            <button
              key={idx}
              onClick={() => toggleIngredient(idx)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-left
                        transition-all duration-150 group
                ${ing.have
                  ? 'bg-warm-50 hover:bg-warm-100'
                  : 'bg-gold-50 border border-gold-200/50 hover:bg-gold-100'
                }
                ${checkedIngredients.has(idx) ? 'opacity-50' : ''}`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                          transition-all duration-150
                  ${checkedIngredients.has(idx)
                    ? 'bg-forest-400 border-forest-400 text-white'
                    : 'border-warm-300 group-hover:border-warm-400'
                  }`}
              >
                {checkedIngredients.has(idx) && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <strong className="font-medium">{ing.amount}</strong>{' '}
                {ing.name}
              </span>
              {!ing.have && (
                <span className="text-xs text-gold-500 font-medium">köp</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section icon={<Wrench size={16} />} title="Verktyg som behövs" color="purple">
        <div className="flex flex-wrap gap-2">
          {recipe.tools.map((tool, idx) => (
            <span
              key={idx}
              className="bg-warm-100 text-warm-700 px-3.5 py-1.5 rounded-full text-sm font-medium
                       flex items-center gap-1.5"
            >
              🔹 {typeof tool === 'string' ? tool : tool.name}
            </span>
          ))}
        </div>
      </Section>

      {/* Steps */}
      <Section icon={<ListOrdered size={16} />} title="Tillvägagångssätt" color="brand">
        <ol className="space-y-0 divide-y divide-warm-100">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 py-3.5">
              <span
                className="w-7 h-7 bg-brand-400 text-white rounded-full flex items-center justify-center
                         text-xs font-bold flex-shrink-0 mt-0.5"
              >
                {idx + 1}
              </span>
              <p className="text-sm text-warm-700 leading-relaxed flex-1">
                {typeof step === 'string' ? step : step.content}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Tips */}
      {recipe.tips && (
        <div className="mt-5 p-4 bg-gold-50 rounded-xl flex gap-3">
          <Lightbulb size={18} className="text-gold-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gold-600">
            <strong className="font-semibold">Tips:</strong> {recipe.tips}
          </p>
        </div>
      )}
    </div>
  );
}

// Section sub-component
function Section({ icon, title, color, children }) {
  const bgMap = {
    forest: 'bg-forest-50 text-forest-400',
    purple: 'bg-purple-50 text-purple-500',
    brand: 'bg-brand-50 text-brand-400',
  };

  return (
    <div className="mt-6">
      <h4 className="flex items-center gap-2.5 font-semibold text-sm text-warm-700 mb-3">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${bgMap[color]}`}>
          {icon}
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}
