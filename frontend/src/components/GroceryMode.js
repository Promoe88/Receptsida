// ============================================
// GroceryMode — Warm voice-controlled shopping
// Guides through store by aisle, bright aesthetic
// ============================================

'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, X, MapPin, Route, Volume2, VolumeX, Mic, MicOff, MessageCircle, Send, Loader2 } from 'lucide-react';
import { groupByAisle } from '../data/recipes';
import { useSpeech, useVoiceInput } from '../hooks/useVoice';
import { useShoppingAssistant } from '../hooks/useRecipes';

export function GroceryMode({ recipe, onClose }) {
  const [checked, setChecked] = useState(new Set());
  const [currentAisle, setCurrentAisle] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();
  const { isListening, supported: voiceSupported, startListening, stopListening } = useVoiceInput();
  const { messages, loading: chatLoading, ask } = useShoppingAssistant(recipe);
  const chatEndRef = useRef(null);

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

  const announceAisle = useCallback((aisleIdx) => {
    if (!voiceEnabled || !aisleGroups[aisleIdx]) return;
    const aisle = aisleGroups[aisleIdx];
    const itemNames = aisle.items.map((i) => `${i.amount} ${i.name}`).join(', ');
    speak(`Gå till ${aisle.name}. Du behöver: ${itemNames}.`);
  }, [voiceEnabled, aisleGroups, speak]);

  useEffect(() => {
    if (voiceEnabled && aisleGroups.length > 0) {
      announceAisle(0);
    }
  }, [voiceEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } else {
      ask(transcript).then((answer) => { if (answer && voiceEnabled) speak(answer); });
      setShowChat(true);
    }
  }, [currentAisle, aisleGroups, announceAisle, speak, ask, voiceEnabled]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function toggleVoiceListening() {
    if (isListening) stopListening();
    else startListening(handleVoiceCommand);
  }

  async function handleSendChat(e) {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput;
    setChatInput('');
    const answer = await ask(question);
    if (answer && voiceEnabled) speak(answer);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-warm-800/30 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl
                  overflow-hidden z-10 flex flex-col shadow-strong"
      >
        {/* Header */}
        <div className="bg-cream-200/60 px-6 py-5 border-b border-warm-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                <Route size={20} className="text-sage-600" />
              </div>
              <div>
                <h2 className="font-display text-xl text-warm-800">Inköpslista</h2>
                <p className="text-warm-400 text-xs mt-0.5">{recipe.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeech(); }}
                className={`p-2 rounded-xl transition-all ${voiceEnabled
                  ? 'bg-sage-100 text-sage-600'
                  : 'text-warm-400 hover:text-warm-700'}`}
              >
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-xl transition-all relative ${showChat
                  ? 'bg-sage-100 text-sage-600'
                  : 'text-warm-400 hover:text-warm-700'}`}
              >
                <MessageCircle size={18} />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-terra-400 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {messages.filter((m) => m.role === 'assistant').length}
                  </span>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-cream-200 text-warm-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-cream-300 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sage-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold text-warm-500 tabular-nums">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                              border transition-all whitespace-nowrap
                      ${idx === currentAisle
                        ? 'bg-sage-100 text-sage-700 border-sage-300'
                        : allChecked
                          ? 'bg-sage-50 text-sage-500 border-sage-200/50'
                          : 'bg-white text-warm-500 border-warm-200 hover:border-warm-300'
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
                <MapPin size={13} className="text-warm-400" />
                <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                  {aisle.icon} {aisle.name}
                </span>
                <div className="flex-1 h-px bg-warm-200" />
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left
                                transition-all duration-200 border
                                ${isDone
                                  ? 'bg-cream-200/50 border-warm-200/40 opacity-50'
                                  : 'bg-white border-warm-200 hover:border-sage-300 hover:shadow-soft'
                                }`}
                    >
                      <span className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center
                                      flex-shrink-0 transition-all duration-200
                        ${isDone
                          ? 'bg-sage-400 border-sage-400 text-white'
                          : 'border-warm-300'
                        }`}>
                        {isDone && <Check size={11} strokeWidth={3} />}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium transition-all
                          ${isDone ? 'line-through text-warm-400' : 'text-warm-800'}`}>
                          {item.name}
                        </span>
                      </div>

                      <span className={`text-xs font-medium flex-shrink-0
                        ${isDone ? 'text-warm-300' : 'text-warm-500'}`}>
                        {item.amount}
                      </span>

                      {item.est_price && (
                        <span className="text-xs text-terra-400 font-semibold flex-shrink-0">
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

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 240, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-warm-200 flex flex-col bg-cream-200/50 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center py-4">
                    <ShoppingBag size={24} className="text-warm-300 mx-auto mb-2" />
                    <p className="text-xs text-warm-400">Fråga om substitut, priser eller var du hittar varor!</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-sage-100 text-sage-800 rounded-br-sm'
                        : 'bg-white text-warm-700 rounded-bl-sm shadow-soft'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-warm-400 px-3 py-2 rounded-2xl rounded-bl-sm shadow-soft flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm">Tänker...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendChat} className="px-3 py-2 border-t border-warm-200">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fråga inköpsguiden..." disabled={chatLoading}
                    className="input flex-1 !rounded-2xl !py-2 text-sm" />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()}
                    className="p-2 rounded-xl bg-sage-400 text-white hover:bg-sage-500 transition-colors disabled:opacity-40">
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom: voice control + done */}
        <div className="p-4 border-t border-warm-200 bg-cream-200/40 flex items-center gap-3">
          {voiceSupported && (
            <button
              onClick={toggleVoiceListening}
              className={`p-3 rounded-2xl transition-all flex-shrink-0
                ${isListening
                  ? 'bg-terra-100 text-terra-500 animate-pulse-soft border-2 border-terra-300'
                  : 'bg-white text-warm-400 hover:text-sage-500 border-2 border-warm-200 hover:border-sage-300'
                }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          {allDone ? (
            <button
              onClick={onClose}
              className="flex-1 btn-primary py-3.5 rounded-2xl font-semibold"
            >
              Allt inhandlat!
            </button>
          ) : isListening ? (
            <div className="flex-1 text-center">
              <p className="text-xs text-warm-500">
                Säg <strong className="text-sage-600">&quot;klar&quot;</strong> för att bocka av,{' '}
                <strong className="text-sage-600">&quot;nästa&quot;</strong> för nästa hylla
              </p>
            </div>
          ) : (
            <div className="flex-1 text-center">
              <p className="text-[11px] text-warm-400">
                Tryck på varor för att bocka av
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
