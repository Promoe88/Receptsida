// ============================================
// SearchBar — Dark theme API search with autocomplete
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAutocomplete } from '../hooks/useRecipes';

const QUICK_TAGS = [
  { label: 'Pasta', emoji: '🍝' },
  { label: 'Kyckling', emoji: '🍗' },
  { label: 'Ris', emoji: '🍚' },
  { label: 'Potatis', emoji: '🥔' },
  { label: 'Lax', emoji: '🐟' },
  { label: 'Ägg', emoji: '🥚' },
  { label: 'Tomat', emoji: '🍅' },
  { label: 'Lök', emoji: '🧅' },
];

const HOUSEHOLDS = [
  { value: 1, emoji: '👤', label: 'Singel' },
  { value: 2, emoji: '👫', label: 'Par' },
  { value: 4, emoji: '👨‍👩‍👧', label: 'Familj' },
  { value: 6, emoji: '👨‍👩‍👧‍👦', label: 'Stor familj' },
];

export function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, getSuggestions, clearSuggestions } = useAutocomplete(150);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleInputChange(value) {
    setQuery(value);
    getSuggestions(value);
    setShowSuggestions(true);
  }

  function handleSuggestionClick(suggestion) {
    const parts = query.split(/,\s*/);
    parts[parts.length - 1] = suggestion.word;
    const newQuery = parts.join(', ') + ', ';
    setQuery(newQuery);
    clearSuggestions();
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function handleTagClick(tag) {
    const current = query.trim();
    if (current && !current.endsWith(',') && !current.endsWith(', ')) {
      setQuery(current + ', ' + tag);
    } else {
      setQuery(current + tag);
    }
    inputRef.current?.focus();
  }

  function handleSubmit() {
    if (query.trim().length < 2) return;
    onSearch(query.trim(), householdSize);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowSuggestions(false);
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search box */}
      <div className="relative" ref={wrapperRef}>
        <div className="flex bg-surface-300 rounded-xl border-2 border-zinc-800
                      focus-within:border-accent-400/50 focus-within:shadow-glow transition-all duration-300">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="T.ex. kyckling, ris, paprika, vitlök..."
            className="flex-1 px-5 py-4 bg-transparent border-none outline-none text-base
                     font-mono text-zinc-100 placeholder:text-zinc-600"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || query.trim().length < 2}
            className="bg-accent-400 text-void px-6 sm:px-8 rounded-r-xl font-semibold
                     hover:bg-accent-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            <span className="hidden sm:inline">Hitta recept</span>
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-surface-300 border border-zinc-800 rounded-xl shadow-strong overflow-hidden z-20">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-surface-200 transition-colors"
                onClick={() => handleSuggestionClick(s)}
              >
                <span className="text-lg">{s.emoji || '🔹'}</span>
                <div>
                  <span className="font-medium text-zinc-200">{s.word}</span>
                  <span className="text-zinc-600 text-xs ml-2">{s.category}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 justify-center mt-5">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            onClick={() => handleTagClick(tag.label)}
            className="bg-surface-300 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-sm
                     text-zinc-500 hover:border-accent-400/30 hover:text-accent-400
                     transition-all duration-200"
          >
            {tag.emoji} {tag.label}
          </button>
        ))}
      </div>

      {/* Household selector */}
      <div className="mt-7">
        <p className="label-sm text-center mb-3">Hushåll</p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          {HOUSEHOLDS.map((h) => (
            <button
              key={h.value}
              onClick={() => setHouseholdSize(h.value)}
              className={`px-5 py-3 rounded-xl border-2 text-center min-w-[90px] transition-all duration-200
                ${
                  householdSize === h.value
                    ? 'border-accent-400/50 bg-accent-400/10'
                    : 'border-zinc-800 bg-surface-300 hover:border-zinc-700'
                }`}
            >
              <span className="text-xl block">{h.emoji}</span>
              <span className="text-xs font-medium text-zinc-400 mt-1 block">{h.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
