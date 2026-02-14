// ============================================
// AppHome — Decision Engine / Command Center
// "OpenAI for Food" — minimal, tool-like,
// ingredient-first with Nisse AI presence
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, ArrowRight, Sparkles, Zap, Trash2, Flame, Package } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

// ── Scenario quick-action chips (Lucide icons, no emojis) ──

const SCENARIOS = [
  { id: 'snabbt', label: 'Snabbt & Billigt', Icon: Zap },
  { id: 'tom-kylen', label: 'Töm kylen', Icon: Trash2 },
  { id: 'middag', label: 'Middag för två', Icon: Flame },
  { id: 'matlador', label: 'Perfekt för matlådor', Icon: Package },
];

// ── Animation variants (spring-based) ──

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
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

  // Space-to-tag: when user types space after a word, convert it to a tag
  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    if (val.endsWith(' ') && val.trim().length > 0) {
      addIngredient(val);
      setInputValue('');
    } else {
      setInputValue(val);
    }
  }, [addIngredient]);

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
    <div className="h-full flex flex-col" style={{ background: '#EBEDF0' }}>
      <motion.div
        className="flex-1 flex flex-col justify-center px-6 pb-12"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ═══ NISSE SPARKLE — AI presence (larger, accent glow) ═══ */}
        <motion.div variants={fadeUp} className="flex justify-center mb-5">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              filter: [
                'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
                'drop-shadow(0 0 20px rgba(255,107,53,0.35))',
                'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <NisseSparkle />
          </motion.div>
        </motion.div>

        {/* ═══ HEADLINE ═══ */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <p className="font-body text-[13px] text-warm-400 mb-1">
            Hej {firstName}
          </p>
          <h1
            className="font-display text-[34px] font-extrabold leading-tight tracking-tight mb-2"
            style={{ color: '#1A1A1A' }}
          >
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
              boxShadow: '0 30px 60px -12px rgba(50,50,93,0.12), 0 18px 36px -18px rgba(0,0,0,0.15)',
              border: '1px solid #D1D5DB',
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Ingredient tags — accent color when active */}
            <AnimatePresence mode="popLayout">
              {ingredients.map((ingredient) => (
                <motion.span
                  key={ingredient}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           text-[13px] font-medium select-none"
                  style={{
                    background: '#FFF0E8',
                    color: '#FF6B35',
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
                    style={{ background: 'rgba(255,107,53,0.15)' }}
                  >
                    <X size={10} strokeWidth={2.5} style={{ color: '#FF6B35' }} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
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
              style={{ background: '#F0F1F3' }}
              aria-label="Röstinmatning"
            >
              <Mic size={16} className="text-warm-400" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* ═══ SCENARIO CHIPS (Lucide icons, no emojis) ═══ */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {SCENARIOS.map((scenario) => {
              const active = activeScenario === scenario.id;
              const ScenarioIcon = scenario.Icon;
              return (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleScenarioTap(scenario)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full
                           text-[13px] font-medium whitespace-nowrap
                           transition-all duration-200"
                  style={{
                    background: active ? '#FF6B35' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#48484A',
                    boxShadow: active
                      ? '0 8px 24px rgba(255,107,53,0.3)'
                      : '0 30px 60px -12px rgba(50,50,93,0.08), 0 18px 36px -18px rgba(0,0,0,0.1)',
                    border: active ? '1px solid transparent' : '1px solid #D1D5DB',
                  }}
                >
                  <ScenarioIcon
                    size={15}
                    strokeWidth={1.5}
                    style={{ color: active ? '#FFFFFF' : '#8E8E93' }}
                  />
                  {scenario.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ EXECUTE BUTTON — Vibrant accent ═══ */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <AnimatePresence>
            {canExecute && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={handleExecute}
                className="execute-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                         font-body font-semibold text-[15px] text-white"
                style={{
                  background: '#FF6B35',
                  boxShadow: '0 8px 32px rgba(255,107,53,0.35)',
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

// ── Nisse Sparkle — larger, accent #FF6B35, with soft glow ──

function NisseSparkle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="rgba(255,107,53,0.06)" />
      <path
        d="M 32 6 C 34 17, 41 24.5, 54 26.5
           C 41 28.5, 34 36, 32 47
           C 30 36, 23 28.5, 10 26.5
           C 23 24.5, 30 17, 32 6 Z"
        fill="#FF6B35"
      />
      <path
        d="M 49 10 C 49.6 13, 52 15.5, 55 16
           C 52 16.5, 49.6 19, 49 22
           C 48.4 19, 46 16.5, 43 16
           C 46 15.5, 48.4 13, 49 10 Z"
        fill="#FF6B35"
        opacity="0.45"
      />
    </svg>
  );
}
