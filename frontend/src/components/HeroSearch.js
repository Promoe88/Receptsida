// ============================================
// HeroSearch — Universal AI search interface
// THE core product: handles all query types
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Sparkles, Users, Clock, Coins, ChefHat, Loader2 } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoice';

const QUICK_PROMPTS = [
  { label: 'Vad har du hemma?', query: '', placeholder: 'kyckling, ris, grädde...', icon: '🧊' },
  { label: 'Billig vardagsmiddag', query: 'billig vardagsmiddag under 60kr för familj', icon: '💰' },
  { label: 'Snabb lunch', query: 'snabb lunch under 20 minuter', icon: '⚡' },
  { label: 'Festmiddag', query: 'festmiddag för 6 personer', icon: '🎉' },
  { label: 'Vegetariskt', query: 'vegetarisk middag med protein', icon: '🥬' },
  { label: 'Meal prep', query: 'meal prep för hela veckan', icon: '📦' },
];

export function HeroSearch({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [householdSize, setHouseholdSize] = useState(2);
  const [showOptions, setShowOptions] = useState(false);
  const [preferences, setPreferences] = useState({});
  const inputRef = useRef(null);
  const { isListening, transcript, supported: voiceSupported, startListening, stopListening } = useVoiceInput();

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    const searchQuery = query.trim() || transcript.trim();
    if (!searchQuery || loading) return;
    onSearch(searchQuery, householdSize, preferences);
  }, [query, transcript, householdSize, preferences, loading, onSearch]);

  const handleQuickPrompt = useCallback((prompt) => {
    if (prompt.query) {
      setQuery(prompt.query);
      onSearch(prompt.query, householdSize, preferences);
    } else {
      setQuery('');
      inputRef.current?.focus();
    }
  }, [householdSize, preferences, onSearch]);

  const handleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((result) => {
        setQuery(result);
        // Auto-submit after voice input
        setTimeout(() => {
          onSearch(result, householdSize, preferences);
        }, 300);
      });
    }
  }, [isListening, stopListening, startListening, householdSize, preferences, onSearch]);

  const togglePref = useCallback((key, value) => {
    setPreferences((prev) => {
      const next = { ...prev };
      if (key === 'dietary') {
        const current = next.dietary || [];
        next.dietary = current.includes(value)
          ? current.filter((d) => d !== value)
          : [...current, value];
        if (next.dietary.length === 0) delete next.dietary;
      } else if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero text */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-accent-400/10 border border-accent-400/20 rounded-full px-4 py-1.5 mb-5">
            <Sparkles size={14} className="text-accent-400" />
            <span className="text-xs font-medium text-accent-400">AI-driven receptsökning</span>
          </div>
          <h1 className="font-display text-display-sm sm:text-display-md lg:text-display-lg text-zinc-50 mb-3">
            Vad vill du laga?
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto font-light">
            Skriv ingredienser, en maträtt, eller berätta vad du är sugen på.
            Vi löser resten.
          </p>
        </motion.div>
      </div>

      {/* Search box */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative"
      >
        <div className={`bg-surface rounded-2xl border overflow-hidden transition-all duration-300 scan-line
                      ${loading ? 'border-accent-400/40 shadow-glow' : 'border-zinc-800 shadow-soft hover:border-zinc-700 focus-within:border-accent-400/40 focus-within:shadow-glow'}`}>
          {/* Main input */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Search size={20} className="text-zinc-600 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={isListening ? transcript || query : query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="kyckling och ris, billig middag, pasta carbonara..."
              className="flex-1 bg-transparent border-none outline-none text-zinc-100
                       placeholder:text-zinc-600 text-base font-mono"
              disabled={loading}
              autoFocus
            />

            {/* Voice button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={handleVoice}
                className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0
                  ${isListening
                    ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30'
                    : 'text-zinc-500 hover:text-accent-400 hover:bg-surface-200'
                  }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
          </div>

          {/* Options bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/60 bg-surface-300/50">
            <div className="flex items-center gap-3">
              {/* Household size */}
              <div className="flex items-center gap-2">
                <Users size={14} className="text-zinc-600" />
                <select
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
                  className="bg-transparent text-xs text-zinc-400 font-mono border-none outline-none cursor-pointer"
                >
                  {[1,2,3,4,5,6,7,8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'person' : 'pers'}</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-4 bg-zinc-800" />

              {/* More options toggle */}
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="text-xs text-zinc-500 hover:text-accent-400 transition-colors font-medium"
              >
                {showOptions ? 'Färre val' : 'Fler val'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || (!query.trim() && !transcript.trim())}
              className="btn-accent !py-2 !px-5 !text-xs flex items-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 size={13} className="animate-spin" /> Söker...</>
              ) : (
                <><ChefHat size={13} /> Sök recept</>
              )}
            </button>
          </div>

          {/* Extended options */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-zinc-800/60"
              >
                <div className="px-5 py-4 space-y-3">
                  {/* Time */}
                  <div className="flex items-center gap-3">
                    <Clock size={13} className="text-zinc-600" />
                    <span className="text-xs text-zinc-500 w-16">Tid:</span>
                    <div className="flex gap-2">
                      {[{ label: '20 min', val: 20 }, { label: '30 min', val: 30 }, { label: '60 min', val: 60 }].map((t) => (
                        <button key={t.val} type="button" onClick={() => togglePref('maxTimeMinutes', t.val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                            ${preferences.maxTimeMinutes === t.val
                              ? 'bg-accent-400/15 text-accent-300 border-accent-400/30'
                              : 'bg-surface-300 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                            }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-3">
                    <Coins size={13} className="text-zinc-600" />
                    <span className="text-xs text-zinc-500 w-16">Budget:</span>
                    <div className="flex gap-2">
                      {[{ label: '50 kr', val: 50 }, { label: '100 kr', val: 100 }, { label: '200 kr', val: 200 }].map((b) => (
                        <button key={b.val} type="button" onClick={() => togglePref('maxBudget', b.val)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                            ${preferences.maxBudget === b.val
                              ? 'bg-accent-400/15 text-accent-300 border-accent-400/30'
                              : 'bg-surface-300 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                            }`}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diet */}
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 w-4 text-center text-xs">🥬</span>
                    <span className="text-xs text-zinc-500 w-16">Diet:</span>
                    <div className="flex flex-wrap gap-2">
                      {['vegetarisk', 'vegan', 'glutenfri', 'laktosfri', 'lchf'].map((d) => (
                        <button key={d} type="button" onClick={() => togglePref('dietary', d)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize
                            ${(preferences.dietary || []).includes(d)
                              ? 'bg-accent-400/15 text-accent-300 border-accent-400/30'
                              : 'bg-surface-300 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                            }`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/30
                       rounded-full px-4 py-1.5 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">Lyssnar...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Quick prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mt-5"
      >
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => handleQuickPrompt(prompt)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-surface-300 border border-zinc-800
                     px-3 py-1.5 rounded-xl text-xs text-zinc-500
                     hover:border-zinc-600 hover:text-zinc-300 hover:bg-surface-200
                     transition-all duration-200 disabled:opacity-40"
          >
            <span>{prompt.icon}</span>
            <span className="font-medium">{prompt.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
