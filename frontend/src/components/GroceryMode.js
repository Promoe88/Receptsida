// ============================================
// GroceryMode — Voice-controlled shopping assistant
// Guides through store by aisle, check off items
// ============================================

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, X, MapPin, Route, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { groupByAisle } from '../data/recipes';
import { useSpeech, useVoiceInput } from '../hooks/useVoice';

export function GroceryMode({ recipe, onClose }) {
  const [checked, setChecked] = useState(new Set());
  const [currentAisle, setCurrentAisle] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();
  const { isListening, supported: voiceSupported, startListening, stopListening } = useVoiceInput();

  // Build shopping list from recipe ingredients (only items not already owned)
  const shoppingItems = useMemo(() => {
    const items = (recipe.ingredients || []).filter((i) => !i.have);
    return items.length > 0 ? items : recipe.ingredients || [];
  }, [recipe.ingredients]);

  const aisleGroups = useMemo(() => groupByAisle(shoppingItems), [shoppingItems]);

  const totalItems = shoppingItems.length;
  const checkedCount = checked.size;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
  const allDone = checkedCount === totalItems && totalItems > 0;

  function toggle(key) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Voice: announce current aisle
  const announceAisle = useCallback((aisleIdx) => {
    if (!voiceEnabled || !aisleGroups[aisleIdx]) return;
    const aisle = aisleGroups[aisleIdx];
    const itemNames = aisle.items.map((i) => `${i.amount} ${i.name}`).join(', ');
    speak(`Gå till ${aisle.name}. Du behöver: ${itemNames}.`);
  }, [voiceEnabled, aisleGroups, speak]);

  // Announce first aisle when voice is enabled
  useEffect(() => {
    if (voiceEnabled && aisleGroups.length > 0) {
      announceAisle(0);
    }
  }, [voiceEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice commands: "klar", "nästa", "check"
  const handleVoiceCommand = useCallback((transcript) => {
    const lower = transcript.toLowerCase();
    if (lower.includes('nästa') || lower.includes('next')) {
      if (currentAisle < aisleGroups.length - 1) {
        setCurrentAisle((prev) => {
          const next = prev + 1;
          announceAisle(next);
          return next;
        });
      }
    } else if (lower.includes('klar') || lower.includes('check') || lower.includes('bocka')) {
      // Check off all items in current aisle
      const aisle = aisleGroups[currentAisle];
      if (aisle) {
        setChecked((prev) => {
          const next = new Set(prev);
          aisle.items.forEach((_, idx) => {
            next.add(`${aisle.name}-${idx}`);
          });
          return next;
        });
        speak(`Alla varor i ${aisle.name} avbockade.`);
      }
    } else if (lower.includes('tillbaka') || lower.includes('back')) {
      if (currentAisle > 0) {
        setCurrentAisle((prev) => {
          const next = prev - 1;
          announceAisle(next);
          return next;
        });
      }
    }
  }, [currentAisle, aisleGroups, announceAisle, speak]);

  function toggleVoiceListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening(handleVoiceCommand);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-surface rounded-t-2xl sm:rounded-2xl
                  overflow-hidden z-10 flex flex-col border border-zinc-800/60"
      >
        {/* Header */}
        <div className="bg-surface-300 px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-400/15 flex items-center justify-center">
                <Route size={20} className="text-accent-400" />
              </div>
              <div>
                <h2 className="font-display text-xl text-zinc-50">Inköpslista</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{recipe.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice toggle */}
              <button
                onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeech(); }}
                className={`p-2 rounded-xl transition-all ${voiceEnabled
                  ? 'bg-accent-400/15 text-accent-400'
                  : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-200 text-zinc-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              {checkedCount}/{totalItems}
            </span>
          </div>

          {/* Aisle navigation */}
          {aisleGroups.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {aisleGroups.map((aisle, idx) => {
                const allChecked = aisle.items.every((_, i) => checked.has(`${aisle.name}-${i}`));
                return (
                  <button
                    key={aisle.name}
                    onClick={() => { setCurrentAisle(idx); announceAisle(idx); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              border transition-all whitespace-nowrap
                      ${idx === currentAisle
                        ? 'bg-accent-400/15 text-accent-300 border-accent-400/30'
                        : allChecked
                          ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                          : 'bg-surface text-zinc-500 border-zinc-800 hover:border-zinc-600'
                      }`}
                  >
                    <span>{aisle.icon}</span>
                    {aisle.name}
                    {allChecked && <Check size={10} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {aisleGroups.map((aisle, aisleIdx) => (
            <div key={aisle.name} className={aisleIdx !== currentAisle ? 'opacity-40' : ''}>
              <div className="flex items-center gap-2 mb-2.5">
                <MapPin size={13} className="text-zinc-600" />
                <span className="label-sm">{aisle.icon} {aisle.name}</span>
                <div className="flex-1 h-px bg-zinc-800/60" />
              </div>

              <div className="space-y-1.5">
                {aisle.items.map((item, idx) => {
                  const key = `${aisle.name}-${idx}`;
                  const isDone = checked.has(key);
                  return (
                    <motion.button
                      key={key}
                      layout
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggle(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                                transition-all duration-200 border
                                ${isDone
                                  ? 'bg-surface-300/50 border-zinc-800/40 opacity-50'
                                  : 'bg-surface-300 border-zinc-800/60 hover:border-zinc-700'
                                }`}
                    >
                      <span className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center
                                      flex-shrink-0 transition-all duration-200
                        ${isDone
                          ? 'bg-accent-400 border-accent-400 text-void'
                          : 'border-zinc-600'
                        }`}>
                        {isDone && <Check size={11} strokeWidth={3} />}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium transition-all
                          ${isDone ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                          {item.name}
                        </span>
                      </div>

                      <span className={`text-xs font-mono flex-shrink-0
                        ${isDone ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {item.amount}
                      </span>

                      {item.est_price && (
                        <span className="text-xs text-accent-400 font-mono flex-shrink-0">
                          {item.est_price}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: voice control + done */}
        <div className="p-4 border-t border-zinc-800 bg-surface-300 flex items-center gap-3">
          {voiceSupported && (
            <button
              onClick={toggleVoiceListening}
              className={`p-3 rounded-xl transition-all flex-shrink-0
                ${isListening
                  ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30'
                  : 'bg-surface text-zinc-500 hover:text-accent-400 border border-zinc-800'
                }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          {allDone ? (
            <button
              onClick={onClose}
              className="flex-1 btn-accent py-3.5 rounded-xl font-semibold"
            >
              Allt inhandlat!
            </button>
          ) : isListening ? (
            <div className="flex-1 text-center">
              <p className="text-xs text-zinc-500">
                Säg <strong className="text-accent-400">"klar"</strong> för att bocka av,{' '}
                <strong className="text-accent-400">"nästa"</strong> för nästa hylla
              </p>
            </div>
          ) : (
            <div className="flex-1 text-center">
              <p className="text-[10px] text-zinc-600 font-mono">
                Tryck på varor för att bocka av
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
