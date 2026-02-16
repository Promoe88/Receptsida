// ============================================
// HeroSearch — Conversational Chef Companion
// Personal greeting with Nisse avatar, breathing animation
// 800px wide, store logos row, spring transitions
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mic, MicOff, Users, Loader2, Sparkles, ArrowRight,
  Zap, Leaf, UsersRound, Package, Wine,
} from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoice';
import { useAuthStore } from '../lib/store';
import { NisseButton } from './NisseButton';
import { NisseLogo } from './NisseLogo';

const CONTEXT_CHIPS = [
  { id: 'barnfamilj', label: 'Barnfamilj', Icon: UsersRound, color: 'sage' },
  { id: 'snabbt', label: 'Snabbt & Billigt', Icon: Zap, color: 'terra' },
  { id: 'matlador', label: 'Matlador', Icon: Package, color: 'sage' },
  { id: 'fest', label: 'Festmaltid', Icon: Sparkles, color: 'terra' },
  { id: 'vegetariskt', label: 'Vegetariskt', Icon: Leaf, color: 'sage' },
  { id: 'helg', label: 'Helgmiddag', Icon: Wine, color: 'terra' },
];

const CONTEXT_MAP = {
  barnfamilj: { occasion: 'vardag', maxBudget: 80, dietary: [] },
  snabbt: { maxTimeMinutes: 20, maxBudget: 60 },
  matlador: { occasion: 'meal-prep' },
  fest: { occasion: 'fest' },
  vegetariskt: { dietary: ['vegetarisk'] },
  helg: { maxTimeMinutes: 60, occasion: 'fest' },
};

const STORE_LOGOS = [
  { name: 'ICA', initials: 'ICA' },
  { name: 'Willys', initials: 'W' },
  { name: 'Coop', initials: 'Co' },
  { name: 'Lidl', initials: 'Li' },
];

export function HeroSearch({ onSearch, loading }) {
  const { user } = useAuthStore();
  const firstName = user?.name ? user.name.split(' ')[0] : null;
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[75vh] px-4 sm:px-6 py-10 sm:py-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full text-center"
        style={{ maxWidth: '800px' }}
      >
        {/* Nisse Avatar — glowing circle with breathing animation */}
        <motion.div
          className="mx-auto mb-6 sm:mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: 96,
              height: 96,
              background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.04) 60%, transparent 100%)',
              boxShadow: '0 0 40px rgba(255,107,53,0.15), 0 0 80px rgba(255,107,53,0.08)',
            }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(255,107,53,0.15), 0 0 80px rgba(255,107,53,0.08)',
                '0 0 50px rgba(255,107,53,0.25), 0 0 100px rgba(255,107,53,0.12)',
                '0 0 40px rgba(255,107,53,0.15), 0 0 80px rgba(255,107,53,0.08)',
              ],
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <NisseLogo variant="icon" size={64} animated />
          </motion.div>
        </motion.div>

        {/* Personal Greeting Headline */}
        <h1
          className="font-display text-display-sm sm:text-display-md lg:text-display-lg tracking-tight mb-4 leading-tight font-bold"
          style={{ color: '#111111' }}
        >
          {firstName ? `Köket är ditt, ${firstName}.` : 'Köket är ditt.'}
        </h1>
        <p className="text-warm-500 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-xl mx-auto leading-relaxed">
          Jag är din personliga kock. Berätta vad du har hemma, så fixar vi resten.
        </p>

        {/* Premium search card */}
        <motion.div
          layout
          className="card p-2 sm:p-3 relative"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1.5px solid rgba(255,107,53,0.25)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
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
            <div className="flex items-center gap-3 px-5 sm:px-6 py-2.5 border-t border-warm-100">
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
                        ? 'bg-sage-400 text-white shadow-teal-glow'
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
                <div className="px-5 sm:px-6 py-5">
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
                      const ChipIcon = chip.Icon;
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
                          <ChipIcon size={15} strokeWidth={2.5} />
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

        {/* Supported Stores row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6"
        >
          <span className="text-[11px] sm:text-xs text-warm-400 uppercase tracking-wider font-medium">Jämför priser hos</span>
          <div className="flex items-center gap-2.5 sm:gap-4">
            {STORE_LOGOS.map((store) => (
              <div
                key={store.name}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-wide"
                style={{
                  color: '#B0B0B5',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                {store.name}
              </div>
            ))}
          </div>
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
