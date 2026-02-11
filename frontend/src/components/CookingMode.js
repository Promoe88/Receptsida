// ============================================
// CookingMode — Voice-controlled cooking with AI Q&A
// Like having a skilled chef in your ear
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, Check, Mic, MicOff, Volume2, VolumeX,
  MessageCircle, Send, Loader2, ChefHat,
} from 'lucide-react';
import { getStepText, getStepDuration } from '../data/recipes';
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

  useEffect(() => {
    setRemaining(duration);
    setIsRunning(false);
  }, [duration]);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
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
          <circle cx="40" cy="40" r="36" fill="none" stroke="#27272A" strokeWidth="4" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={remaining === 0 ? '#34D399' : '#FF5C00'}
            strokeWidth="4"
            strokeLinecap="round"
            className="timer-ring"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (progress / 100) * circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-zinc-100 tabular-nums font-mono">
            {remaining === 0 ? (
              <Check size={28} className="text-emerald-400" />
            ) : (
              formatTime(remaining)
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { setRemaining(duration); setIsRunning(false); }}
          className="p-2.5 rounded-xl bg-surface-300 text-zinc-500 hover:bg-surface-200 hover:text-zinc-300 transition-colors border border-zinc-800"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-3.5 rounded-xl text-void transition-all shadow-glow-sm
            ${isRunning ? 'bg-zinc-500 hover:bg-zinc-400' : 'bg-accent-400 hover:bg-accent-300'}`}
        >
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

  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();
  const { isListening, supported: voiceSupported, startListening, stopListening } = useVoiceInput();
  const { messages, loading: chatLoading, ask } = useCookingAssistant(recipe);
  const chatEndRef = useRef(null);

  const steps = recipe.steps || [];
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const stepText = getStepText(step);
  const stepDuration = getStepDuration(step);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Read step aloud when voice is enabled
  useEffect(() => {
    if (voiceEnabled && stepText) {
      speak(`Steg ${currentStep + 1}. ${stepText}`);
    }
  }, [currentStep, voiceEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, totalSteps]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  // Keyboard navigation
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

  // Voice commands
  const handleVoiceCommand = useCallback((transcript) => {
    const lower = transcript.toLowerCase();
    if (lower.includes('nästa') || lower.includes('next')) {
      goNext();
    } else if (lower.includes('tillbaka') || lower.includes('föregående')) {
      goPrev();
    } else {
      // Treat as a question to the cooking assistant
      ask(transcript).then((answer) => {
        if (answer && voiceEnabled) {
          speak(answer);
        }
      });
      setShowChat(true);
    }
  }, [goNext, goPrev, ask, voiceEnabled, speak]);

  function toggleVoiceListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening(handleVoiceCommand);
    }
  }

  // Send chat message
  async function handleSendChat(e) {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput;
    setChatInput('');
    const answer = await ask(question);
    if (answer && voiceEnabled) {
      speak(answer);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hud-mode flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-400/15 flex items-center justify-center">
            <ChefHat size={16} className="text-accent-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">{recipe.title}</h2>
            <p className="text-xs text-zinc-600 font-mono">Matlagningsläge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice TTS toggle */}
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeech(); }}
            className={`p-2 rounded-xl transition-all ${voiceEnabled
              ? 'bg-accent-400/15 text-accent-400'
              : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-xl transition-all relative ${showChat
              ? 'bg-accent-400/15 text-accent-400'
              : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MessageCircle size={18} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-400 rounded-full text-void
                             text-[9px] font-bold flex items-center justify-center">
                {messages.filter((m) => m.role === 'assistant').length}
              </span>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-200 text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800">
        <motion.div
          className="h-full bg-accent-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step content */}
        <div className={`flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full
                        transition-all duration-300 ${showChat ? 'lg:max-w-xl' : ''}`}>
          {/* Step indicator dots */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-150
                  ${idx === currentStep
                    ? 'bg-accent-400 scale-125 shadow-glow-sm'
                    : completedSteps.has(idx)
                      ? 'bg-emerald-400'
                      : 'bg-zinc-800'
                  }`}
              />
            ))}
          </div>

          {/* Step number */}
          <span className="label-sm text-accent-400 mb-4 font-mono">
            Steg {currentStep + 1} av {totalSteps}
          </span>

          {/* Step text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl text-zinc-100
                       text-center leading-snug max-w-xl"
            >
              {stepText}
            </motion.p>
          </AnimatePresence>

          {/* Timer */}
          {stepDuration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10"
            >
              <CountdownTimer
                key={currentStep}
                duration={stepDuration}
                onComplete={() => {
                  if (voiceEnabled) speak('Tiden är ute! Gå vidare till nästa steg.');
                }}
              />
            </motion.div>
          )}

          {/* Voice mic button - floating */}
          {voiceSupported && (
            <div className="mt-8">
              <button
                onClick={toggleVoiceListening}
                className={`p-4 rounded-2xl transition-all duration-200 shadow-lg
                  ${isListening
                    ? 'bg-red-500/20 text-red-400 animate-pulse border-2 border-red-500/30 shadow-red-500/10'
                    : 'bg-surface-300 text-zinc-500 hover:text-accent-400 border-2 border-zinc-800 hover:border-accent-400/30'
                  }`}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <p className="text-[10px] text-zinc-600 text-center mt-2 font-mono">
                {isListening ? 'Lyssnar...' : 'Fråga kocken'}
              </p>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="border-l border-zinc-800 flex flex-col bg-surface-300/50 overflow-hidden"
            >
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <ChefHat size={16} className="text-accent-400" />
                <span className="text-sm font-semibold text-zinc-200">AI-kockassistent</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <ChefHat size={32} className="text-zinc-700 mx-auto mb-3" />
                    <p className="text-xs text-zinc-600 max-w-[200px] mx-auto">
                      Fråga mig vad som helst om receptet! Temperatur, tidpunkt, ersättningar...
                    </p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-accent-400/15 text-accent-200 rounded-br-none'
                        : 'bg-surface text-zinc-300 rounded-bl-none border border-zinc-800/60'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface text-zinc-500 px-3.5 py-2.5 rounded-xl rounded-bl-none
                                  border border-zinc-800/60 flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm">Tänker...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendChat} className="px-3 py-3 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fråga kocken..."
                    className="flex-1 bg-surface rounded-xl px-3.5 py-2.5 text-sm text-zinc-200
                             placeholder:text-zinc-600 border border-zinc-800 outline-none
                             focus:border-accent-400/40"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-accent-400 text-void hover:bg-accent-300
                             transition-colors disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-zinc-800 px-6 py-4 flex items-center justify-between
                    bg-surface/80 backdrop-blur-md">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:text-zinc-200 transition-colors px-4 py-2.5 rounded-xl"
        >
          <ChevronLeft size={18} />
          Föregående
        </button>

        <div className="text-[10px] text-zinc-700 font-mono hidden sm:block">
          {voiceSupported
            ? 'Röst: "nästa" / "tillbaka" / ställ frågor'
            : 'Piltangenter eller mellanslag'}
        </div>

        {currentStep === totalSteps - 1 ? (
          <button
            onClick={onClose}
            className="btn-accent px-8"
          >
            Klar!
          </button>
        ) : (
          <button
            onClick={goNext}
            className="btn-accent flex items-center gap-2 px-6"
          >
            Nästa steg
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
