// ============================================
// CookingMode — Warm voice-controlled cooking
// AI Q&A chef assistant, bright aesthetic
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, Check, Mic, MicOff, Volume2, VolumeX,
  MessageCircle, Send, Loader2, ChefHat,
} from 'lucide-react';
import { getStepText, getStepDuration, getStepVoiceCue } from '../data/recipes';
import { useSpeech, useVoiceInput } from '../hooks/useVoice';
import { useCookingAssistant } from '../hooks/useRecipes';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function CountdownTimer({ duration, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setRemaining(duration); setIsRunning(false); }, [duration]);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) { clearInterval(intervalRef.current); setIsRunning(false); onComplete?.(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, remaining, onComplete]);

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#E8E4DF" strokeWidth="4" />
          <circle cx="40" cy="40" r="36" fill="none"
            stroke={remaining === 0 ? '#7C9A82' : '#C4704B'}
            strokeWidth="4" strokeLinecap="round" className="timer-ring"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (progress / 100) * circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-warm-800 tabular-nums font-mono">
            {remaining === 0 ? <Check size={28} className="text-sage-500" /> : formatTime(remaining)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => { setRemaining(duration); setIsRunning(false); }}
          className="p-2.5 rounded-xl bg-cream-200 text-warm-500 hover:bg-cream-300 transition-colors">
          <RotateCcw size={16} />
        </button>
        <button onClick={() => setIsRunning(!isRunning)}
          className={`p-3.5 rounded-xl text-white transition-all shadow-soft
            ${isRunning ? 'bg-warm-400 hover:bg-warm-500' : 'bg-sage-400 hover:bg-sage-500'}`}>
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  );
}

export function CookingMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const { speak, stop: stopSpeech } = useSpeech();
  const { isListening, supported: voiceSupported, startListening, stopListening } = useVoiceInput();
  const { messages, loading: chatLoading, ask } = useCookingAssistant(recipe);
  const chatEndRef = useRef(null);

  const steps = recipe.steps || [];
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const stepText = getStepText(step);
  const stepDuration = getStepDuration(step);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const voiceCue = getStepVoiceCue(step);

  useEffect(() => {
    if (voiceEnabled && voiceCue) {
      speak(`Steg ${currentStep + 1}. ${voiceCue}`);
    }
  }, [currentStep, voiceEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  }, [currentStep, totalSteps]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  useEffect(() => {
    function handleKey(e) {
      if (showChat && e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, onClose, showChat]);

  const handleVoiceCommand = useCallback((transcript) => {
    const lower = transcript.toLowerCase();
    if (lower.includes('nästa') || lower.includes('next')) goNext();
    else if (lower.includes('tillbaka') || lower.includes('föregående')) goPrev();
    else {
      const ctx = { currentStep, totalSteps, inputMode: 'voice' };
      ask(transcript, ctx).then((answer) => { if (answer && voiceEnabled) speak(answer); });
      setShowChat(true);
    }
  }, [goNext, goPrev, ask, voiceEnabled, speak, currentStep, totalSteps]);

  function toggleVoiceListening() {
    if (isListening) stopListening();
    else startListening(handleVoiceCommand);
  }

  async function handleSendChat(e) {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput;
    setChatInput('');
    const ctx = { currentStep, totalSteps, inputMode: voiceEnabled ? 'voice' : 'text' };
    const answer = await ask(question, ctx);
    if (answer && voiceEnabled) speak(answer);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="hud-mode flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
            <ChefHat size={17} className="text-sage-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-warm-800">{recipe.title}</h2>
            <p className="text-xs text-warm-400">Matlagningsläge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeech(); }}
            className={`p-2 rounded-xl transition-all ${voiceEnabled ? 'bg-sage-100 text-sage-600' : 'text-warm-400 hover:text-warm-700'}`}>
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-xl transition-all relative ${showChat ? 'bg-sage-100 text-sage-600' : 'text-warm-400 hover:text-warm-700'}`}>
            <MessageCircle size={18} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-terra-400 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {messages.filter((m) => m.role === 'assistant').length}
              </span>
            )}
          </button>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream-200 text-warm-400 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-cream-300">
        <motion.div className="h-full bg-sage-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full
                        transition-all duration-300 ${showChat ? 'lg:max-w-xl' : ''}`}>
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentStep(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150
                  ${idx === currentStep ? 'bg-sage-400 scale-125 shadow-sage-glow'
                    : completedSteps.has(idx) ? 'bg-sage-300' : 'bg-cream-400'}`}
              />
            ))}
          </div>

          <span className="label-sm text-sage-500 mb-4">Steg {currentStep + 1} av {totalSteps}</span>

          <AnimatePresence mode="wait">
            <motion.p key={currentStep}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl text-warm-800 text-center leading-snug max-w-xl">
              {stepText}
            </motion.p>
          </AnimatePresence>

          {stepDuration && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10">
              <CountdownTimer key={currentStep} duration={stepDuration}
                onComplete={() => { if (voiceEnabled) speak('Tiden är ute! Gå vidare till nästa steg.'); }} />
            </motion.div>
          )}

          {voiceSupported && (
            <div className="mt-8">
              <button onClick={toggleVoiceListening}
                className={`p-4 rounded-3xl transition-all duration-200 shadow-soft
                  ${isListening
                    ? 'bg-terra-100 text-terra-500 animate-pulse-soft border-2 border-terra-300'
                    : 'bg-white text-warm-400 hover:text-sage-500 border-2 border-warm-200 hover:border-sage-300'}`}>
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <p className="text-[11px] text-warm-400 text-center mt-2">
                {isListening ? 'Lyssnar...' : 'Fråga kocken'}
              </p>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="border-l border-warm-200 flex flex-col bg-cream-200/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-warm-200 flex items-center gap-2">
                <ChefHat size={16} className="text-sage-500" />
                <span className="text-sm font-semibold text-warm-800">AI-kockassistent</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <ChefHat size={32} className="text-warm-300 mx-auto mb-3" />
                    <p className="text-xs text-warm-400 max-w-[200px] mx-auto">
                      Fråga mig vad som helst om receptet!
                    </p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-sage-100 text-sage-800 rounded-br-sm'
                        : 'bg-white text-warm-700 rounded-bl-sm shadow-soft'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-warm-400 px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-soft flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm">Tänker...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChat} className="px-3 py-3 border-t border-warm-200">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fråga kocken..." disabled={chatLoading}
                    className="input flex-1 !rounded-2xl !py-2.5 text-sm" />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-sage-400 text-white hover:bg-sage-500 transition-colors disabled:opacity-40">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-warm-200 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <button onClick={goPrev} disabled={currentStep === 0}
          className="flex items-center gap-2 text-sm font-medium text-warm-500 disabled:opacity-30 hover:text-warm-800 transition-colors px-4 py-2.5 rounded-xl">
          <ChevronLeft size={18} /> Föregående
        </button>
        <div className="text-[11px] text-warm-400 hidden sm:block">
          {voiceSupported ? 'Röst: "nästa" / "tillbaka" / ställ frågor' : 'Piltangenter / mellanslag'}
        </div>
        {currentStep === totalSteps - 1 ? (
          <button onClick={onClose} className="btn-primary px-8">Klar!</button>
        ) : (
          <button onClick={goNext} className="btn-primary flex items-center gap-2 px-6">
            Nästa steg <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
