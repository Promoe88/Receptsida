// ============================================
// AppHome — Native app home screen
// Compact search, quick chips, recent searches
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Users, Loader2, Clock, ChevronRight } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoice';
import { useAuthStore } from '../../lib/store';

const QUICK_CHIPS = [
  { id: 'snabbt', label: 'Snabbt', icon: '⚡' },
  { id: 'vegetariskt', label: 'Veg', icon: '🌿' },
  { id: 'barnfamilj', label: 'Familj', icon: '👨‍👩‍👧‍👦' },
  { id: 'matlador', label: 'Matlådor', icon: '📦' },
  { id: 'fest', label: 'Fest', icon: '🥂' },
  { id: 'helg', label: 'Helg', icon: '🍷' },
];

const CONTEXT_MAP = {
  barnfamilj: { occasion: 'vardag', maxBudget: 80, dietary: [] },
  snabbt: { maxTimeMinutes: 20, maxBudget: 60 },
  matlador: { occasion: 'meal-prep' },
  fest: { occasion: 'fest' },
  vegetariskt: { dietary: ['vegetarisk'] },
  helg: { maxTimeMinutes: 60, occasion: 'fest' },
};

export function AppHome({ onSearch, loading, recentSearches }) {
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [householdSize, setHouseholdSize] = useState(2);
  const [selectedChips, setSelectedChips] = useState([]);
  const { isListening, transcript, supported: voiceSupported, startListening, stopListening } = useVoiceInput();

  const buildPreferences = useCallback(() => {
    const prefs = {};
    for (const chipId of selectedChips) {
      const mapping = CONTEXT_MAP[chipId];
      if (mapping) {
        Object.entries(mapping).forEach(([key, value]) => {
          if (key === 'dietary') {
            prefs.dietary = [...(prefs.dietary || []), ...value];
          } else {
            prefs[key] = value;
          }
        });
      }
    }
    return Object.keys(prefs).length > 0 ? prefs : undefined;
  }, [selectedChips]);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    const searchQuery = query.trim() || transcript.trim();
    if (!searchQuery || loading) return;

    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Medium });
    }).catch(() => {});

    onSearch(searchQuery, householdSize, buildPreferences());
  }, [query, transcript, householdSize, loading, onSearch, buildPreferences]);

  const handleQuickSearch = useCallback((text) => {
    setQuery(text);
    onSearch(text, householdSize, buildPreferences());
  }, [householdSize, onSearch, buildPreferences]);

  const toggleChip = useCallback((chipId) => {
    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Light });
    }).catch(() => {});

    setSelectedChips((prev) =>
      prev.includes(chipId)
        ? prev.filter((c) => c !== chipId)
        : [...prev, chipId]
    );
  }, []);

  const handleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((result) => setQuery(result));
    }
  }, [isListening, stopListening, startListening]);

  const greeting = user?.name ? user.name.split(' ')[0] : null;

  return (
    <div className="px-5 pt-6 pb-4 safe-top">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {greeting && (
          <p className="text-warm-500 text-sm mb-0.5">Hej, {greeting}!</p>
        )}
        <h1 className="font-display text-2xl text-warm-800 mb-5">
          Vad lagar vi idag?
        </h1>
      </motion.div>

      {/* Search bar */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-white rounded-2xl shadow-card">
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <Search size={20} className="text-warm-400 flex-shrink-0" />
            <input
              type="text"
              value={isListening ? transcript || query : query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ingredienser, maträtt, budget..."
              className="flex-1 bg-transparent border-none outline-none text-warm-800
                       placeholder:text-warm-400 text-[15px] font-body"
              disabled={loading}
            />
            {voiceSupported && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleVoice}
                className={`p-2 rounded-full transition-all flex-shrink-0
                  ${isListening
                    ? 'bg-terra-100 text-terra-500 animate-pulse-soft'
                    : 'text-warm-400 active:bg-warm-100'
                  }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </motion.button>
            )}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={loading || (!query.trim() && !transcript.trim())}
              className="bg-sage-400 text-white rounded-full p-2.5
                       disabled:opacity-30 transition-all duration-150"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </motion.button>
          </div>

          {/* Household size */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 border-t border-warm-100">
            <Users size={14} className="text-warm-400" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setHouseholdSize(n)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold transition-all duration-150
                    ${householdSize === n
                      ? 'bg-sage-400 text-white'
                      : 'bg-cream-200 text-warm-500 active:bg-sage-100'
                    }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
            <span className="text-[11px] text-warm-400">
              {householdSize === 1 ? 'person' : 'pers'}
            </span>
          </div>
        </div>
      </motion.form>

      {/* Quick context chips */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => {
            const active = selectedChips.includes(chip.id);
            return (
              <motion.button
                key={chip.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleChip(chip.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium
                  transition-all duration-150
                  ${active
                    ? 'bg-sage-100 border border-sage-300 text-sage-700'
                    : 'bg-white border border-warm-200 text-warm-600'
                  }`}
              >
                <span className="text-sm">{chip.icon}</span>
                {chip.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent searches */}
      {recentSearches?.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-3">
            Senaste sökningar
          </h2>
          <div className="space-y-1.5">
            {recentSearches.slice(0, 5).map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickSearch(item.query)}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 bg-white rounded-2xl
                         border border-warm-100 transition-colors duration-150"
              >
                <Clock size={14} className="text-warm-300 flex-shrink-0" />
                <span className="text-sm text-warm-600 flex-1 text-left truncate">
                  {item.query}
                </span>
                <ChevronRight size={14} className="text-warm-300 flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Voice listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 flex items-center justify-center gap-2 bg-terra-50 border border-terra-200
                     rounded-full px-4 py-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-terra-400 animate-pulse" />
            <span className="text-sm text-terra-600 font-medium">Lyssnar...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
