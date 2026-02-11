// ============================================
// HeroSearch — Command-line AI search interface
// Dark theme with Context Chips + terminal aesthetic
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Terminal, Zap } from 'lucide-react';

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

const CONTEXT_CHIPS = [
  { label: 'Familj (4p)', value: 'familj-4', icon: '👨‍👩‍👧‍👦' },
  { label: 'Under 50kr', value: 'budget-50', icon: '💰' },
  { label: 'Meal Prep', value: 'meal-prep', icon: '📦' },
  { label: 'Date Night', value: 'date-night', icon: '🕯️' },
  { label: 'Under 20min', value: 'quick-20', icon: '⚡' },
  { label: 'Vegetariskt', value: 'vegetarian', icon: '🥬' },
];

export function HeroSearch({ onSearch, loading }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeChips, setActiveChips] = useState(new Set());
  const [isFocused, setIsFocused] = useState(false);
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

  function toggleChip(chipValue) {
    setActiveChips((prev) => {
      const next = new Set(prev);
      if (next.has(chipValue)) next.delete(chipValue);
      else next.add(chipValue);
      return next;
    });
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
      <div className="flex items-center gap-2 mb-4">
        <Terminal size={12} className="text-accent-400" />
        <span className="label-sm text-accent-400">Sök ingredienser</span>
      </div>

      {/* Context Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CONTEXT_CHIPS.map((chip) => {
          const isActive = activeChips.has(chip.value);
          return (
            <motion.button
              key={chip.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChip(chip.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                        border transition-all duration-200
                        ${isActive
                          ? 'bg-accent-400/15 text-accent-300 border-accent-400/30 shadow-glow-sm'
                          : 'bg-surface-300 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                        }`}
            >
              <span className="text-sm">{chip.icon}</span>
              {chip.label}
            </motion.button>
          );
        })}
      </div>

      {/* Command search box */}
      <div className={`bg-surface rounded-2xl border overflow-hidden
                    transition-all duration-300 scan-line
                    ${isFocused
                      ? 'border-accent-400/40 shadow-glow'
                      : 'border-zinc-800 shadow-soft'
                    }`}>
        {/* Tags + input */}
        <div className="flex flex-wrap items-center gap-2 min-h-[52px] px-4 py-3">
          <span className="text-accent-400 font-mono text-lg font-bold select-none">&gt;</span>

          <AnimatePresence mode="popLayout">
            {tags.map((tag, idx) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                layout
                className="inline-flex items-center gap-1.5 bg-accent-400/15 text-accent-300
                         px-3 py-1.5 rounded-lg text-sm font-medium border border-accent-400/25"
              >
                {tag}
                <button
                  onClick={() => removeTag(idx)}
                  className="text-accent-400/50 hover:text-accent-300 transition-colors"
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={tags.length === 0 ? 'kyckling, grädde, ris...' : 'Lägg till fler...'}
            className="flex-1 min-w-[120px] py-1.5 bg-transparent border-none outline-none
                     text-zinc-100 placeholder:text-zinc-600 text-sm font-mono"
            disabled={loading}
          />
        </div>

        {/* Divider + button */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-zinc-800/60 bg-surface-300/50">
          <span className="text-[10px] text-zinc-600 font-mono">
            {tags.length > 0 ? `${tags.length} ingredienser` : 'Enter för att lägga till'}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading || (tags.length === 0 && !inputValue.trim())}
            className="btn-accent !py-2 !px-5 !text-xs flex items-center gap-2"
          >
            <Zap size={13} />
            Exekvera
          </motion.button>
        </div>
      </div>

      {/* Ingredient suggestions */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {suggestionsFiltered.slice(0, 8).map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.93 }}
            onClick={() => addTag(item.label)}
            className="inline-flex items-center gap-1.5 bg-surface-300 border border-zinc-800
                     px-2.5 py-1.5 rounded-lg text-xs text-zinc-500
                     hover:border-zinc-600 hover:text-zinc-300 hover:bg-surface-200
                     transition-all duration-200"
          >
            <Plus size={10} className="text-zinc-600" />
            <span>{item.emoji}</span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
