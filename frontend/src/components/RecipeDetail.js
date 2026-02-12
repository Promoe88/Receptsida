// ============================================
// RecipeDetail — Glassmorphism recipe modal
// Floating cook button, soft shadows, clean UI
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Users, ExternalLink,
  ShoppingCart, ListOrdered, Play, ShoppingBag, Check,
  Lightbulb, Wrench, Coins, Share2, Send, ArrowRight,
  Wine, Refrigerator, Scale, AlertTriangle, GraduationCap,
} from 'lucide-react';
import { CookingMode } from './CookingMode';
import { GroceryMode } from './GroceryMode';
import { getStepText } from '../data/recipes';
import { recipes as recipesApi } from '../lib/api';

export function RecipeDetail({ recipe, onClose }) {
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showGroceryMode, setShowGroceryMode] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareStatus, setShareStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  if (!recipe) return null;

  function toggleStep(idx) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  if (showCookingMode) {
    return <CookingMode recipe={recipe} onClose={() => setShowCookingMode(false)} />;
  }

  return (
    <>
      <AnimatePresence>
        {showGroceryMode && (
          <GroceryMode recipe={recipe} onClose={() => setShowGroceryMode(false)} />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-warm-900/20 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-[32px]
                    overflow-hidden z-10 flex flex-col shadow-strong"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-warm-200/30 px-6 py-5 flex items-start justify-between"
               style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
            <div className="flex-1 pr-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-warm-800 tracking-tight">{recipe.title}</h2>
              {recipe.source_name && (
                <p className="text-sm text-warm-500 mt-1 flex items-center gap-1.5">
                  Källa:{' '}
                  {recipe.source_url ? (
                    <a href={recipe.source_url} target="_blank" rel="noopener noreferrer"
                      className="text-sage-500 font-medium hover:underline inline-flex items-center gap-1">
                      {recipe.source_name} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="font-medium">{recipe.source_name}</span>
                  )}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="badge-warm"><Clock size={12} /> {recipe.time_minutes || recipe.prepTime} min</span>
                <span className="badge-warm"><Users size={12} /> {recipe.servings} port</span>
                <span className="badge-sage">{recipe.difficulty}</span>
                {recipe.cost_estimate && (
                  <span className="badge-terra"><Coins size={12} /> {recipe.cost_estimate}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-cream-200 text-warm-400 hover:text-warm-700 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-6">
              {recipe.description && (
                <p className="text-warm-600 leading-relaxed text-sm">{recipe.description}</p>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setShowCookingMode(true)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm text-white transition-all active:scale-[0.97]"
                  style={{ backgroundColor: '#1A1A2E' }}
                >
                  <Play size={16} /> Laga
                </button>
                <button
                  onClick={() => setShowGroceryMode(true)}
                  className="btn-outline flex items-center justify-center gap-2 py-3.5"
                >
                  <ShoppingBag size={16} /> Handla
                </button>
                <button
                  onClick={() => setShowShareForm(!showShareForm)}
                  className="btn-ghost flex items-center justify-center gap-2 py-3.5"
                >
                  <Share2 size={16} /> Dela
                </button>
              </div>

              {/* Share form */}
              {showShareForm && (
                <div className="p-4 bg-cream-200/50 rounded-2xl border border-warm-200 space-y-3">
                  <p className="text-sm font-medium text-warm-700">Dela receptet via e-post</p>
                  {shareStatus === 'sent' ? (
                    <p className="text-sm text-sage-600 flex items-center gap-2">
                      <Check size={16} /> Skickat!
                    </p>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setShareStatus('sending');
                        try {
                          await recipesApi.share(recipe.id, shareEmail);
                          setShareStatus('sent');
                          setShareEmail('');
                        } catch {
                          setShareStatus('error');
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => { setShareEmail(e.target.value); setShareStatus(null); }}
                        className="input flex-1"
                        placeholder="mottagare@email.se"
                        required
                      />
                      <button
                        type="submit"
                        disabled={shareStatus === 'sending'}
                        className="btn-primary px-4 flex items-center gap-1.5"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                  {shareStatus === 'error' && (
                    <p className="text-xs text-terra-500">Kunde inte skicka. Försök igen.</p>
                  )}
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                    <ShoppingCart size={14} />
                  </span>
                  Ingredienser
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(recipe.ingredients || []).map((ing, idx) => (
                    <div key={idx}
                      className={`rounded-2xl px-4 py-3 text-sm border
                        ${ing.have ? 'bg-cream-200 border-warm-200/60' : 'bg-sage-50/50 border-sage-200/40'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0
                          ${ing.have ? 'bg-sage-400' : 'bg-terra-400'}`} />
                        <span className="flex-1">
                          <strong className="font-medium text-warm-800">{ing.amount}</strong>{' '}
                          <span className="text-warm-600">{ing.name}</span>
                        </span>
                        {!ing.have && ing.est_price && (
                          <span className="text-xs text-terra-400 font-semibold">{ing.est_price}</span>
                        )}
                      </div>
                      {ing.substitutes?.length > 0 && (
                        <p className="text-[11px] text-warm-400 mt-1 ml-4.5 pl-0.5">
                          Alt: {ing.substitutes.join(', ')}
                        </p>
                      )}
                      {ing.tip && (
                        <p className="text-[11px] text-sage-500 mt-0.5 ml-4.5 pl-0.5">{ing.tip}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              {recipe.tools?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                      <Wrench size={14} />
                    </span>
                    Verktyg
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tools.map((tool, idx) => (
                      <span key={idx} className="bg-cream-200 text-warm-600 px-4 py-2 rounded-2xl text-sm font-medium">
                        {typeof tool === 'string' ? tool : tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div>
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-warm-800 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-cream-200 text-sage-500 flex items-center justify-center">
                    <ListOrdered size={14} />
                  </span>
                  Gör så här
                </h3>
                <ol className="space-y-0 divide-y divide-warm-100">
                  {(recipe.steps || []).map((step, idx) => (
                    <li key={idx} className="py-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => toggleStep(idx)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center
                                    text-xs font-bold flex-shrink-0 mt-0.5 transition-all duration-200
                                    ${checkedSteps.has(idx)
                                      ? 'bg-sage-400 text-white'
                                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                                    }`}
                        >
                          {checkedSteps.has(idx) ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed transition-all duration-200
                            ${checkedSteps.has(idx) ? 'text-warm-400 line-through' : 'text-warm-700'}`}>
                            {getStepText(step)}
                          </p>
                          {step.warning && !checkedSteps.has(idx) && (
                            <p className="text-[11px] text-terra-500 mt-1.5 flex items-center gap-1">
                              <AlertTriangle size={10} /> {step.warning}
                            </p>
                          )}
                          {step.beginner_tip && !checkedSteps.has(idx) && (
                            <p className="text-[11px] text-sage-500 mt-1">
                              <GraduationCap size={10} className="inline mr-1" />{step.beginner_tip}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {recipe.tips && (
                <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200/40 flex gap-3">
                  <Lightbulb size={18} className="text-sage-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warm-700">
                    <strong className="font-semibold text-sage-600">Tips:</strong> {recipe.tips}
                  </p>
                </div>
              )}

              {/* Drink pairing, leftovers, scaling */}
              {(recipe.drink_pairing || recipe.leftover_tips || recipe.scaling_notes) && (
                <div className="grid grid-cols-1 gap-2">
                  {recipe.drink_pairing && (
                    <div className="p-3.5 bg-cream-200/50 rounded-2xl border border-warm-200/50 flex gap-3">
                      <Wine size={15} className="text-terra-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-warm-600">
                        <strong className="font-medium text-warm-700">Dryck:</strong> {recipe.drink_pairing}
                      </p>
                    </div>
                  )}
                  {recipe.leftover_tips && (
                    <div className="p-3.5 bg-cream-200/50 rounded-2xl border border-warm-200/50 flex gap-3">
                      <Refrigerator size={15} className="text-sage-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-warm-600">
                        <strong className="font-medium text-warm-700">Rester:</strong> {recipe.leftover_tips}
                      </p>
                    </div>
                  )}
                  {recipe.scaling_notes && (
                    <div className="p-3.5 bg-cream-200/50 rounded-2xl border border-warm-200/50 flex gap-3">
                      <Scale size={15} className="text-warm-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-warm-600">
                        <strong className="font-medium text-warm-700">Skala:</strong> {recipe.scaling_notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Floating "Start cooking" button */}
          <div className="sticky bottom-0 px-5 py-4 border-t border-warm-200/30"
               style={{ background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
            <button
              onClick={() => setShowCookingMode(true)}
              className="w-full text-white py-4 rounded-full font-bold text-base
                       shadow-medium active:scale-[0.97] transition-all duration-200
                       flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              Börja laga <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
