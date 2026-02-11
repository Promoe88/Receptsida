// ============================================
// HeroSearch — Refined ingredient tag search
// Premium feel with motion
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus } from 'lucide-react';

const SUGGESTED_INGREDIENTS = [
  { label: 'Kyckling', emoji: '🍗' },
  { label: 'Lax', emoji: '🐟' },
  { label: 'Pasta', emoji: '🍝' },
  { label: 'Ris', emoji: '🍚' },
  { label: 'Potatis', emoji: '🥔' },
  { label: 'Ägg', emoji: '🥚' },
  { label: 'Grädde', emoji: '🥛' },
  { label: 'Lök', emoji: '🧅' },
  { label: 'Vitlök', emoji: '🧄' },
  { label: 'Paprika', emoji: '🫑' },
  { label: 'Bacon', emoji: '🥓' },
  { label: 'Falukorv', emoji: '🌭' },
];

export function HeroSearch({ onSearch, loading }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTag = useCallback(
    (label) => {
      const normalized = label.trim().toLowerCase();
      if (!normalized) return;
      if (tags.some((t) => t.toLowerCase() === normalized)) return;
      setTags((prev) => [...prev, label.trim()]);
      setInputValue('');
      inputRef.current?.focus();
    },
    [tags]
  );

  function removeTag(index) {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim()) { e.preventDefault(); addTag(inputValue); }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) removeTag(tags.length - 1);
    if (e.key === ',' && inputValue.trim()) { e.preventDefault(); addTag(inputValue); }
  }

  function handleSubmit() {
    const finalTags = [...tags];
    if (inputValue.trim()) finalTags.push(inputValue.trim());
    if (finalTags.length === 0) return;
    onSearch(finalTags);
  }

  const suggestionsFiltered = SUGGESTED_INGREDIENTS.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.label.toLowerCase())
  );

  return (
    <div>
      {/* Section label */}
      <p className="section-label mb-3">Sök efter ingrediens</p>

      {/* Search box */}
      <div className="bg-white rounded-3xl shadow-soft border border-cream-100
                    focus-within:border-pine-400 focus-within:shadow-glow
                    transition-all duration-300 p-3">
        {/* Tags + input */}
        <div className="flex flex-wrap items-center gap-2 min-h-[44px] px-2">
          <AnimatePresence mode="popLayout">
            {tags.map((tag, idx) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                layout
                className="inline-flex items-center gap-1.5 bg-pine-600 text-white
                         px-3 py-1.5 rounded-xl text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => removeTag(idx)}
                  className="text-pine-200 hover:text-white transition-colors"
                  aria-label={`Ta bort ${tag}`}
                >
                  <X size={13} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'T.ex. kyckling, grädde, ris...' : 'Lägg till fler...'}
            className="flex-1 min-w-[120px] py-2 px-1 bg-transparent border-none outline-none
                     text-cream-800 placeholder:text-cream-300 text-sm"
            disabled={loading}
          />
        </div>

        {/* Divider + button */}
        <div className="flex justify-end mt-2 pt-2 border-t border-cream-100">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading || (tags.length === 0 && !inputValue.trim())}
            className="bg-action-400 text-white px-5 py-2 rounded-xl font-semibold text-sm
                     hover:bg-action-500 transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            <Search size={15} />
            Sök recept
          </motion.button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {suggestionsFiltered.slice(0, 8).map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.93 }}
            onClick={() => addTag(item.label)}
            className="inline-flex items-center gap-1 bg-white border border-cream-200
                     px-2.5 py-1.5 rounded-xl text-xs text-cream-500
                     hover:border-pine-300 hover:text-pine-600 hover:bg-pine-50/50
                     transition-all duration-200"
          >
            <Plus size={10} className="text-cream-300" />
            <span>{item.emoji}</span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
