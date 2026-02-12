// ============================================
// HeroSearch — Guided multi-step search hero
// 70% viewport, native-feel with spring transitions
// Multi-step: Input -> Context Chips -> Search
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Users, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoice';
import { NisseButton } from './NisseButton';

const CONTEXT_CHIPS = [
  { id: 'barnfamilj', label: 'Barnfamilj', icon: '👨‍👩‍👧‍👦', color: 'sage' },
  { id: 'snabbt', label: 'Snabbt & Billigt', icon: '⚡', color: 'terra' },
  { id: 'matlador', label: 'Matlådor', icon: '📦', color: 'sage' },
  { id: 'fest', label: 'Festmåltid', icon: '🥂', color: 'terra' },
  { id: 'vegetariskt', label: 'Vegetariskt', icon: '🌿', color: 'sage' },
  { id: 'helg', label: 'Helgmiddag', icon: '🍷', color: 'terra' },
];

const CONTEXT_MAP = {
  barnfamilj: { occasion: 'vardag', maxBudget: 80, dietary: [] },
  snabbt: { maxTimeMinutes: 20, maxBudget: 60 },
  matlador: { occasion: 'meal-prep' },
  fest: { occasion: 'fest' },
  vegetariskt: { dietary: ['vegetarisk'] },
  helg: { maxTimeMinutes: 60, occasion: 'fest' },
};

export function HeroSearch({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [householdSize, setHouseholdSize] = useState(2);
  const [selectedChips, setSelectedChips] = useState([]);
  const [step, setStep] = useState(1);
  const inputRef = useRef(null);
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

    if (step === 1) {
      setStep(2);
      return;
    }

    onSearch(searchQuery, householdSize, buildPreferences());
  }, [query, transcript, householdSize, loading, onSearch, step, buildPreferences]);

  const handleDirectSearch = useCallback(() => {
    const searchQuery = query.trim() || transcript.trim();
    if (!searchQuery || loading) return;
    onSearch(searchQuery, householdSize, buildPreferences());
  }, [query, transcript, householdSize, loading, onSearch, buildPreferences]);

  const toggleChip = useCallback((chipId) => {
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
      startListening((result) => {
        setQuery(result);
        setStep(2);
      });
    }
  }, [isListening, stopListening, startListening]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="font-display text-display-sm sm:text-display-md lg:text-display-lg text-warm-800 mb-4">
          Vad lagar vi idag?
        </h1>
        <p className="text-warm-500 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Skriv ingredienser, en maträtt, eller berätta vad du är sugen på.
        </p>

        {/* Search card */}
        <motion.div layout className="card p-2 sm:p-3 relative">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4">
              <Search size={22} className="text-warm-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={isListening ? transcript || query : query}
                onChange={(e) => { setQuery(e.target.value); if (step === 2) setStep(1); }}
                placeholder="kyckling, pasta, billig middag, festmåltid..."
                className="flex-1 bg-transparent border-none outline-none text-warm-800
                         placeholder:text-warm-400 text-base sm:text-lg font-body"
                disabled={loading}
                autoFocus
              />

              {voiceSupported && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoice}
                  className={`p-2.5 rounded-full transition-all duration-200 flex-shrink-0
                    ${isListening
                      ? 'bg-terra-100 text-terra-500 animate-pulse-soft'
                      : 'text-warm-400 hover:text-sage-400 hover:bg-sage-50'
                    }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>
              )}

              <NisseButton
                type="submit"
                disabled={loading || (!query.trim() && !transcript.trim())}
                size="md"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : step === 1 ? (
                  <ArrowRight size={18} />
                ) : (
                  <Search size={18} />
                )}
                <span className="hidden sm:inline">{loading ? 'Söker...' : step === 1 ? 'Nästa' : 'Sök recept'}</span>
              </NisseButton>
            </div>

            {/* Household size bar */}
            <div className="flex items-center gap-3 px-5 py-2.5 border-t border-warm-100">
              <Users size={15} className="text-warm-400" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <motion.button
                    key={n}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setHouseholdSize(n)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all
                      ${householdSize === n
                        ? 'bg-sage-400 text-white shadow-sage-glow'
                        : 'bg-cream-200 text-warm-500 hover:bg-sage-50 hover:text-sage-600'
                      }`}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
              <span className="text-xs text-warm-400 ml-1">
                {householdSize === 1 ? 'person' : 'personer'}
              </span>
            </div>
          </form>

          {/* Step 2: Context chips */}
          <AnimatePresence>
            {step === 2 && query.trim() && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden border-t border-warm-100"
              >
                <div className="px-5 py-5">
                  <p className="text-sm text-warm-500 mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-terra-400" />
                    Välj kontext för bättre resultat
                    <button
                      onClick={handleDirectSearch}
                      className="ml-auto text-xs text-sage-400 hover:text-sage-600 font-medium underline underline-offset-2"
                    >
                      Hoppa över
                    </button>
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {CONTEXT_CHIPS.map((chip) => {
                      const active = selectedChips.includes(chip.id);
                      return (
                        <motion.button
                          key={chip.id}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleChip(chip.id)}
                          className={active
                            ? (chip.color === 'terra' ? 'chip-terra' : 'chip-active')
                            : 'chip'
                          }
                        >
                          <span className="text-base">{chip.icon}</span>
                          {chip.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  <NisseButton
                    onClick={handleDirectSearch}
                    disabled={loading}
                    fullWidth
                    className="mt-5"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Söker recept...</>
                    ) : (
                      <><Search size={16} /> Hitta recept för &ldquo;{query.trim()}&rdquo;</>
                    )}
                  </NisseButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Voice listening indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 inline-flex items-center gap-2 bg-terra-50 border border-terra-200
                       rounded-full px-4 py-2"
            >
              <span className="w-2 h-2 rounded-full bg-terra-400 animate-pulse" />
              <span className="text-sm text-terra-600 font-medium">Lyssnar...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
