// ============================================
// AppHome — Native app home screen
// Soft UI, vector icons, staggered animations
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mic, MicOff, Users, Loader2, Clock, ChevronRight,
  Zap, Leaf, UsersRound, Package, Sparkles, Wine,
} from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoice';
import { useAuthStore } from '../../lib/store';

const QUICK_CHIPS = [
  { id: 'snabbt', label: 'Snabbt', icon: Zap },
  { id: 'vegetariskt', label: 'Veg', icon: Leaf },
  { id: 'barnfamilj', label: 'Familj', icon: UsersRound },
  { id: 'matlador', label: 'Matlador', icon: Package },
  { id: 'fest', label: 'Fest', icon: Sparkles },
  { id: 'helg', label: 'Helg', icon: Wine },
];

const CONTEXT_MAP = {
  barnfamilj: { occasion: 'vardag', maxBudget: 80, dietary: [] },
  snabbt: { maxTimeMinutes: 20, maxBudget: 60 },
  matlador: { occasion: 'meal-prep' },
  fest: { occasion: 'fest' },
  vegetariskt: { dietary: ['vegetarisk'] },
  helg: { maxTimeMinutes: 60, occasion: 'fest' },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
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
    <motion.div
      className="px-5 pt-6 pb-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        {greeting && (
          <p className="text-warm-400 text-sm font-medium mb-0.5">Hej, {greeting}</p>
        )}
        <h1 className="font-display text-2xl font-bold text-warm-800 mb-5 tracking-tight">
          Vad lagar vi idag?
        </h1>
      </motion.div>

      {/* Search bar */}
      <motion.form onSubmit={handleSubmit} variants={fadeUp}>
        <div className="card p-1.5">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <Search size={20} className="text-warm-400 flex-shrink-0" strokeWidth={2.5} />
            <input
              type="text"
              value={isListening ? transcript || query : query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ingredienser, matratt, budget..."
              className="flex-1 bg-transparent border-none outline-none text-warm-800
                       placeholder:text-warm-400 text-[15px] font-medium"
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
              className="bg-sage-400 text-white rounded-full p-2.5 shadow-sage-glow
                       disabled:opacity-30 transition-all duration-150"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} strokeWidth={2.5} />
              )}
            </motion.button>
          </div>

          {/* Household size */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 border-t border-warm-200/50">
            <Users size={14} className="text-warm-400" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setHouseholdSize(n)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all duration-150
                    ${householdSize === n
                      ? 'bg-sage-400 text-white shadow-sage-glow'
                      : 'bg-cream-200 text-warm-500 active:bg-sage-100'
                    }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
            <span className="text-[11px] text-warm-400 font-medium">
              {householdSize === 1 ? 'person' : 'pers'}
            </span>
          </div>
        </div>
      </motion.form>

      {/* Quick context chips — vector icons */}
      <motion.div className="mt-4" variants={fadeUp}>
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const active = selectedChips.includes(chip.id);
            return (
              <motion.button
                key={chip.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleChip(chip.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-semibold
                  transition-all duration-150
                  ${active
                    ? 'bg-sage-400 text-white shadow-sage-glow'
                    : 'bg-white text-warm-600 shadow-soft'
                  }`}
              >
                <Icon size={14} strokeWidth={2.5} />
                {chip.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent searches */}
      {recentSearches?.length > 0 && (
        <motion.div className="mt-8" variants={fadeUp}>
          <h2 className="text-xs font-bold text-warm-400 uppercase tracking-wider mb-3">
            Senaste sokningar
          </h2>
          <div className="space-y-2">
            {recentSearches.slice(0, 5).map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickSearch(item.query)}
                className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-2xl
                         shadow-soft transition-all duration-150"
              >
                <Clock size={14} className="text-warm-300 flex-shrink-0" />
                <span className="text-sm text-warm-600 font-medium flex-1 text-left truncate">
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
            className="mt-4 flex items-center justify-center gap-2 bg-terra-50
                     rounded-full px-4 py-2.5 shadow-soft"
          >
            <span className="w-2 h-2 rounded-full bg-terra-400 animate-pulse" />
            <span className="text-sm text-terra-600 font-semibold">Lyssnar...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
