// ============================================
// IngredientSearch — Add ingredients screen
// Large title, teal add button, emoji list, orange X
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, X, ArrowRight, Loader2 } from 'lucide-react';

const INGREDIENT_EMOJIS = {
  // Proteins
  'kycklingfilé': '🍗', 'kyckling': '🍗', 'fläskfilé': '🥩', 'fläsk': '🥩',
  'nötfärs': '🥩', 'färs': '🥩', 'lax': '🐟', 'fisk': '🐟', 'räkor': '🦐',
  'korv': '🌭', 'bacon': '🥓', 'ägg': '🥚',
  // Dairy
  'ost': '🧀', 'grädde': '🥛', 'mjölk': '🥛', 'smör': '🧈',
  'crème fraiche': '🥛', 'yoghurt': '🥛', 'cream cheese': '🧀',
  // Vegetables
  'tomat': '🍅', 'tomater': '🍅', 'krossade tomater': '🍅',
  'lök': '🧅', 'vitlök': '🧄', 'paprika': '🫑', 'gurka': '🥒',
  'morot': '🥕', 'morötter': '🥕', 'potatis': '🥔', 'broccoli': '🥦',
  'spenat': '🥬', 'sallad': '🥬', 'majs': '🌽', 'svamp': '🍄',
  'avokado': '🥑', 'zucchini': '🥒', 'aubergine': '🍆',
  // Fruits
  'citron': '🍋', 'lime': '🍋', 'äpple': '🍎', 'banan': '🍌',
  // Carbs & grains
  'pasta': '🍝', 'ris': '🍚', 'bröd': '🍞', 'nudlar': '🍜',
  'tortilla': '🫓', 'couscous': '🍚',
  // Pantry
  'olivolja': '🫒', 'olja': '🫒', 'salt': '🧂', 'peppar': '🧂',
  'socker': '🍬', 'mjöl': '🌾', 'soja': '🥫', 'sojasås': '🥫',
  'kokosmjölk': '🥥',
};

function getEmoji(name) {
  const lower = name.toLowerCase().trim();
  if (INGREDIENT_EMOJIS[lower]) return INGREDIENT_EMOJIS[lower];
  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return '🥘';
}

const EMOJI_BG_COLORS = [
  'bg-orange-50', 'bg-teal-50', 'bg-amber-50', 'bg-rose-50',
  'bg-sky-50', 'bg-lime-50', 'bg-violet-50', 'bg-emerald-50',
];

export function IngredientSearch({ onBack, onSearch, loading }) {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState('');

  const addIngredient = useCallback(() => {
    const name = input.trim();
    if (!name || ingredients.some((i) => i.name.toLowerCase() === name.toLowerCase())) return;

    setIngredients((prev) => [
      ...prev,
      { id: Date.now(), name, emoji: getEmoji(name) },
    ]);
    setInput('');
  }, [input, ingredients]);

  const removeIngredient = useCallback((id) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  }, [addIngredient]);

  const handleSearch = useCallback(() => {
    if (ingredients.length === 0 || loading) return;
    const query = ingredients.map((i) => i.name).join(', ');
    onSearch(query, 2);
  }, [ingredients, loading, onSearch]);

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 -ml-1"
        >
          <ChevronLeft size={26} className="text-warm-700" strokeWidth={2} />
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero text-warm-800 mb-1"
        >
          Vad har du i köket?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-label text-warm-400 mb-5"
        >
          Lägg till ingredienser
        </motion.p>
      </div>

      {/* Input row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-5 mb-5"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="T.ex. kyckling, pasta, tomat..."
            className="input flex-1"
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={addIngredient}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                     disabled:opacity-30 transition-opacity"
            style={{
              background: '#2ABFBF',
              boxShadow: '0 4px 24px rgba(42,191,191,0.25)',
            }}
          >
            <Plus size={22} className="text-white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>

      {/* Ingredient list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ingredient, idx) => (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 mb-2.5 shadow-sm"
            >
              {/* Emoji in colored square */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${EMOJI_BG_COLORS[idx % EMOJI_BG_COLORS.length]}`}
              >
                <span className="text-xl">{ingredient.emoji}</span>
              </div>

              {/* Name */}
              <span className="flex-1 text-body font-medium text-warm-800">
                {ingredient.name}
              </span>

              {/* Remove button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => removeIngredient(ingredient.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#FFF0EB' }}
              >
                <X size={16} className="text-terra-400" strokeWidth={2.5} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {ingredients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">🧑‍🍳</span>
            <p className="text-label text-warm-400">
              Lägg till ingredienser du har hemma
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-5 pt-3"
          style={{
            background: 'linear-gradient(to top, #F5F5F7 80%, transparent)',
          }}
        >
          <p className="text-center text-caption text-warm-400 font-medium mb-2.5">
            {ingredients.length} ingrediens{ingredients.length !== 1 ? 'er' : ''}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-warm-800 text-white
                     py-4 rounded-full font-bold text-body shadow-btn
                     disabled:opacity-40 transition-opacity"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Hitta recept <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
