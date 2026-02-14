// ============================================
// RecipeDetail — Pixel-perfect recipe view
// Orange badge, emoji title, image+play, servings
// control, ingredient checklist with "Har hemma"
// ============================================

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Share2, Bookmark, Play, Minus, Plus,
  Check, ArrowRight, ShoppingBag, ListOrdered,
  Lightbulb, Wine, Wrench, AlertTriangle, GraduationCap,
  ShoppingCart,
} from 'lucide-react';
import { CookingMode } from './CookingMode';
import { GroceryMode } from './GroceryMode';
import { getStepText } from '../data/recipes';

const INGREDIENT_EMOJIS = {
  'kycklingfilé': '🍗', 'kyckling': '🍗', 'pasta': '🍝', 'penne': '🍝',
  'grädde': '🥛', 'crème fraiche': '🥛', 'vitlök': '🧄', 'lök': '🧅',
  'tomat': '🍅', 'krossade tomater': '🍅', 'ost': '🧀', 'parmesan': '🧀',
  'smör': '🧈', 'olivolja': '🫒', 'olja': '🫒', 'salt': '🧂', 'peppar': '🧂',
  'basilika': '🌿', 'oregano': '🌿', 'spenat': '🥬', 'paprika': '🫑',
  'lax': '🐟', 'räkor': '🦐', 'ris': '🍚', 'potatis': '🥔',
  'morot': '🥕', 'broccoli': '🥦', 'ägg': '🥚', 'mjölk': '🥛',
  'socker': '🍬', 'mjöl': '🌾',
};

function getIngredientEmoji(name) {
  const lower = (name || '').toLowerCase().trim();
  if (INGREDIENT_EMOJIS[lower]) return INGREDIENT_EMOJIS[lower];
  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return '🥘';
}

/** Scale an amount string like "200 g" by a factor */
function scaleAmount(amount, factor) {
  if (!amount || factor === 1) return amount;
  return amount.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
    const num = parseFloat(match.replace(',', '.'));
    const scaled = Math.round(num * factor * 10) / 10;
    return String(scaled).replace('.', ',');
  });
}

export function RecipeDetail({ recipe, onClose, rank }) {
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showGroceryMode, setShowGroceryMode] = useState(false);
  const [servings, setServings] = useState(recipe?.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(false);

  const scaleFactor = useMemo(() => {
    const original = recipe?.servings || 4;
    return servings / original;
  }, [servings, recipe?.servings]);

  if (!recipe) return null;

  function toggleIngredient(idx) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

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

      <div className="fixed inset-0 z-50 flex flex-col bg-cream">
        {/* Scrollable content */}
        <div className="flex-1 soft-scroll">
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <ChevronLeft size={26} className="text-warm-700" strokeWidth={2} />
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"
              >
                <Share2 size={18} className="text-warm-600" strokeWidth={1.8} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBookmarked(!bookmarked)}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"
              >
                <Bookmark
                  size={18}
                  className={bookmarked ? 'text-terra-400' : 'text-warm-600'}
                  fill={bookmarked ? '#FF7A50' : 'none'}
                  strokeWidth={1.8}
                />
              </motion.button>
            </div>
          </div>

          <div className="px-5">
            {/* ── Orange badge ── */}
            {rank && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3"
              >
                <span
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-caption font-bold text-white"
                  style={{ background: '#FF7A50' }}
                >
                  #{rank} — Bästa valet
                </span>
              </motion.div>
            )}

            {/* ── Title ── */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-title text-warm-800 mb-2 leading-tight"
            >
              {recipe.title}
            </motion.h1>

            {/* ── Description ── */}
            {recipe.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-label text-warm-500 leading-relaxed mb-5"
              >
                {recipe.description}
              </motion.p>
            )}

            {/* ── Recipe image with play button ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative rounded-2xl overflow-hidden mb-5 shadow-card"
              style={{ height: '220px' }}
            >
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                  <span className="text-5xl">🍳</span>
                </div>
              )}
              {/* Play button overlay */}
              <button
                onClick={() => setShowCookingMode(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  <Play size={22} className="text-warm-800 ml-0.5" fill="#1A1A2E" />
                </div>
              </button>
            </motion.div>

            {/* ── Servings control ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-5 mb-7"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: '#E8F8F8' }}
              >
                <Minus size={18} className="text-sage-400" strokeWidth={2.5} />
              </motion.button>
              <span className="text-body font-bold text-warm-800 min-w-[90px] text-center">
                {servings} portioner
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: '#E8F8F8' }}
              >
                <Plus size={18} className="text-sage-400" strokeWidth={2.5} />
              </motion.button>
            </motion.div>

            {/* ── Ingredients ── */}
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-body font-bold text-warm-800 mb-4">
                <span className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center">
                  <ShoppingCart size={15} className="text-sage-400" />
                </span>
                Ingredienser
              </h3>
              <div className="space-y-2">
                {(recipe.ingredients || []).map((ing, idx) => {
                  const checked = checkedIngredients.has(idx);
                  const emoji = getIngredientEmoji(ing.name);

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleIngredient(idx)}
                      className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm text-left"
                    >
                      {/* Checkbox circle */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          background: checked ? '#2ABFBF' : 'transparent',
                          border: checked ? 'none' : '2px solid #E5E5EA',
                        }}
                      >
                        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>

                      {/* Emoji */}
                      <span className="text-lg flex-shrink-0">{emoji}</span>

                      {/* Name + amount */}
                      <span
                        className={`flex-1 text-label font-medium transition-all duration-200 ${
                          checked ? 'text-warm-400 line-through' : 'text-warm-800'
                        }`}
                      >
                        {ing.name}{' '}
                        {ing.amount && (
                          <span className="text-warm-400 font-normal">
                            {scaleFactor !== 1
                              ? scaleAmount(ing.amount, scaleFactor)
                              : ing.amount}
                          </span>
                        )}
                      </span>

                      {/* "Har hemma" badge */}
                      {ing.have && (
                        <span
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: '#E8F8F8', color: '#2ABFBF' }}
                        >
                          Har hemma
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Tools ── */}
            {recipe.tools?.length > 0 && (
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-body font-bold text-warm-800 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-cream-200 flex items-center justify-center">
                    <Wrench size={15} className="text-warm-500" />
                  </span>
                  Verktyg
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tools.map((tool, idx) => (
                    <span key={idx} className="bg-white text-warm-600 px-4 py-2 rounded-full text-label font-medium shadow-sm">
                      {typeof tool === 'string' ? tool : tool.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Steps ── */}
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-body font-bold text-warm-800 mb-4">
                <span className="w-8 h-8 rounded-xl bg-cream-200 flex items-center justify-center">
                  <ListOrdered size={15} className="text-warm-500" />
                </span>
                Gör så här
              </h3>
              <div className="space-y-0 divide-y divide-warm-100">
                {(recipe.steps || []).map((step, idx) => (
                  <div key={idx} className="py-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleStep(idx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                                  text-xs font-bold flex-shrink-0 mt-0.5 transition-all duration-200
                                  ${checkedSteps.has(idx)
                                    ? 'bg-sage-400 text-white'
                                    : 'bg-sage-50 text-sage-600'
                                  }`}
                      >
                        {checkedSteps.has(idx) ? <Check size={12} strokeWidth={3} /> : idx + 1}
                      </button>
                      <div className="flex-1">
                        <p className={`text-label leading-relaxed transition-all duration-200
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
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tips ── */}
            {recipe.tips && (
              <div className="p-4 bg-sage-50 rounded-2xl mb-6 flex gap-3">
                <Lightbulb size={18} className="text-sage-500 flex-shrink-0 mt-0.5" />
                <p className="text-label text-warm-700">
                  <strong className="font-semibold text-sage-600">Tips:</strong> {recipe.tips}
                </p>
              </div>
            )}

            {/* ── Drink pairing ── */}
            {recipe.drink_pairing && (
              <div className="p-3.5 bg-white rounded-2xl shadow-sm mb-2.5 flex gap-3">
                <Wine size={15} className="text-terra-400 flex-shrink-0 mt-0.5" />
                <p className="text-label text-warm-600">
                  <strong className="font-medium text-warm-700">Dryck:</strong> {recipe.drink_pairing}
                </p>
              </div>
            )}

            {/* ── Grocery button ── */}
            <div className="mb-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowGroceryMode(true)}
                className="w-full flex items-center justify-center gap-2 bg-white text-warm-800
                         py-3.5 rounded-full font-bold text-label shadow-sm border border-warm-200/60"
              >
                <ShoppingBag size={18} /> Handla ingredienser
              </motion.button>
            </div>
          </div>

          {/* Bottom spacer for fixed button */}
          <div className="h-24" />
        </div>

        {/* ── Floating "Start cooking" button ── */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3"
          style={{
            background: 'linear-gradient(to top, #F5F5F7 80%, transparent)',
            paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCookingMode(true)}
            className="w-full flex items-center justify-center gap-2 bg-warm-800 text-white
                     py-4 rounded-full font-bold text-body shadow-btn"
          >
            Börja laga <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </>
  );
}
