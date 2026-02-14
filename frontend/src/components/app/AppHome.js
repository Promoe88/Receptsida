// ============================================
// AppHome — Decision Engine / Command Center
// "OpenAI for Food" — minimal, tool-like,
// ingredient-first with Nisse AI presence
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { NisseLogo } from '../NisseLogo';

// ── Scenario quick-action chips ──

const SCENARIOS = [
  { id: 'snabbt', label: 'Snabbt & Billigt', emoji: '⚡️' },
  { id: 'tom-kylen', label: 'Töm kylen', emoji: '🧹' },
  { id: 'middag', label: 'Middag för två', emoji: '🕯️' },
  { id: 'matlador', label: 'Perfekt för matlådor', emoji: '📦' },
];

// ── Animation variants ──

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

// ── Component ──

export function AppHome({ onSearch, onStartSearch }) {
  const { user } = useAuthStore();
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);
  const inputRef = useRef(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'där';

  // ── Ingredient management ──

  const addIngredient = useCallback((text) => {
    const cleaned = text.trim().toLowerCase();
    if (cleaned && !ingredients.includes(cleaned)) {
      setIngredients((prev) => [...prev, cleaned]);
    }
  }, [ingredients]);

  const removeIngredient = useCallback((ingredient) => {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  }, []);

  const handleInputKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
        setInputValue('');
      }
    }
    if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients[ingredients.length - 1]);
    }
  }, [inputValue, ingredients, addIngredient, removeIngredient]);

  // ── Scenario chips ──

  const handleScenarioTap = useCallback((scenario) => {
    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Light });
    }).catch(() => {});

    setActiveScenario((prev) => (prev === scenario.id ? null : scenario.id));
  }, []);

  // ── Execute search ──

  const handleExecute = useCallback(() => {
    import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
      Haptics.impact({ style: ImpactStyle.Medium });
    }).catch(() => {});

    if (ingredients.length > 0) {
      onSearch?.(ingredients.join(', '));
    } else if (activeScenario) {
      const scenario = SCENARIOS.find((s) => s.id === activeScenario);
      onSearch?.(scenario?.label || '');
    }
  }, [ingredients, activeScenario, onSearch]);

  const canExecute = ingredients.length > 0 || activeScenario;

  return (
    <div className="h-full flex flex-col" style={{ background: '#F5F5F7' }}>
      <motion.div
        className="flex-1 flex flex-col justify-center px-6 pb-12"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ═══ NISSE LOGO — AI presence ═══ */}
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <NisseLogo variant="icon" size={72} />
          </motion.div>
        </motion.div>

        {/* ═══ HEADLINE ═══ */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <p className="font-body text-[13px] text-warm-400 mb-1">
            Hej {firstName}
          </p>
          <h1 className="font-display text-[32px] font-bold text-warm-800 leading-tight tracking-tight mb-2">
            Vad lagar vi idag?
          </h1>
          <p className="font-body text-[14px] text-warm-400 max-w-[260px] mx-auto">
            Berätta vad du har hemma — Nisse löser resten
          </p>
        </motion.div>

        {/* ═══ MASTER PROMPT — Ingredient input ═══ */}
        <motion.div variants={fadeUp} className="mb-6">
          <div
            className="bg-white w-full min-h-[56px] flex flex-wrap items-center gap-2 cursor-text"
            style={{
              borderRadius: '20px',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Ingredient tags */}
            <AnimatePresence mode="popLayout">
              {ingredients.map((ingredient) => (
                <motion.span
                  key={ingredient}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           text-[13px] font-medium select-none"
                  style={{
                    background: '#EEF3F0',
                    color: '#5A7D6C',
                  }}
                >
                  {ingredient}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIngredient(ingredient);
                    }}
                    className="flex items-center justify-center w-4 h-4 rounded-full
                             transition-colors"
                    style={{ background: 'rgba(90,125,108,0.15)' }}
                  >
                    <X size={10} strokeWidth={2.5} style={{ color: '#5A7D6C' }} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                ingredients.length === 0
                  ? 'Lägg till ingredienser...'
                  : 'Lägg till fler...'
              }
              className="flex-1 min-w-[100px] bg-transparent border-none outline-none
                       text-warm-800 placeholder:text-warm-300 font-body text-[15px]"
            />

            {/* Mic icon */}
            <button
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                       transition-colors"
              style={{ background: '#F5F5F7' }}
              aria-label="Röstinmatning"
            >
              <Mic size={16} className="text-warm-400" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* ═══ SCENARIO CHIPS ═══ */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {SCENARIOS.map((scenario) => {
              const active = activeScenario === scenario.id;
              return (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleScenarioTap(scenario)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full
                           text-[13px] font-medium whitespace-nowrap
                           transition-all duration-200"
                  style={{
                    background: active ? '#111111' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#48484A',
                    boxShadow: active
                      ? '0 4px 16px rgba(17,17,17,0.2)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    border: active ? '1px solid transparent' : '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <span className="text-[15px]">{scenario.emoji}</span>
                  {scenario.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ EXECUTE BUTTON ═══ */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <AnimatePresence>
            {canExecute && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleExecute}
                className="execute-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                         font-body font-semibold text-[15px] text-white"
                style={{
                  background: '#111111',
                  boxShadow: '0 8px 32px rgba(17,17,17,0.25)',
                }}
              >
                <Sparkles size={18} strokeWidth={2} />
                Hitta recept
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}