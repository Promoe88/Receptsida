// ============================================
// HeroSearch — "The Magic Search" with ingredient tags
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, X, Sparkles, Plus } from 'lucide-react';

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

      // Prevent duplicates
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
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
    if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
  }

  function handleSubmit() {
    if (tags.length === 0 && !inputValue.trim()) return;

    // Add any remaining input as a tag
    const finalTags = [...tags];
    if (inputValue.trim()) {
      finalTags.push(inputValue.trim());
    }

    onSearch(finalTags);
  }

  const suggestionsFiltered = SUGGESTED_INGREDIENTS.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.label.toLowerCase())
  );

  return (
    <section className="relative">
      {/* Hero content */}
      <div className="text-center pt-16 sm:pt-24 pb-6 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                      bg-forest-50 text-forest-400 text-xs font-semibold mb-6 tracking-wide">
          <Sparkles size={13} />
          SVERIGES SMARTASTE RECEPTSIDA
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-warm-800 leading-[1.1] mb-4 tracking-tight">
          Vad har du
          <br />
          <span className="text-brand-400 italic">hemma idag?</span>
        </h1>

        <p className="text-warm-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-light mb-10">
          Skriv in ingredienser — vi hittar recept och visar bästa priset hos
          ICA, Willys, Coop och Lidl.
        </p>
      </div>

      {/* Search input area */}
      <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div
          className="bg-white rounded-2xl shadow-strong border-2 border-warm-100
                    focus-within:border-brand-400 focus-within:shadow-glow
                    transition-all duration-300 p-3"
        >
          {/* Tags display area */}
          <div className="flex flex-wrap items-center gap-2 min-h-[48px] px-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-500
                         px-3 py-1.5 rounded-xl text-sm font-medium group
                         animate-fade-in"
              >
                {tag}
                <button
                  onClick={() => removeTag(idx)}
                  className="text-brand-300 hover:text-brand-500 transition-colors ml-0.5"
                  aria-label={`Ta bort ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? 'T.ex. kyckling, grädde, ris...' : 'Lägg till fler...'}
              className="flex-1 min-w-[140px] py-2 px-1 bg-transparent border-none outline-none
                       text-warm-800 placeholder:text-warm-300 text-base font-light"
              disabled={loading}
            />
          </div>

          {/* Search button */}
          <div className="flex justify-end mt-2 pt-2 border-t border-warm-100">
            <button
              onClick={handleSubmit}
              disabled={loading || (tags.length === 0 && !inputValue.trim())}
              className="bg-brand-400 text-white px-6 py-2.5 rounded-xl font-semibold text-sm
                       hover:bg-brand-500 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              <Search size={16} />
              Hitta recept
            </button>
          </div>
        </div>

        {/* Suggested ingredient chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {suggestionsFiltered.slice(0, 8).map((item) => (
            <button
              key={item.label}
              onClick={() => addTag(item.label)}
              className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm
                       border border-warm-200 px-3.5 py-2 rounded-2xl text-sm
                       text-warm-500 hover:border-brand-300 hover:text-brand-400 hover:bg-brand-50/50
                       transition-all duration-200 group"
            >
              <Plus size={12} className="text-warm-300 group-hover:text-brand-400 transition-colors" />
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
