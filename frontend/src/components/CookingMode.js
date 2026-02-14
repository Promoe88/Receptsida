// ============================================
// CookingMode — Design system §10
// Dark background #1A1A2E, white text
// Cards: rgba(255,255,255,0.1), 16px radius
// Buttons: teal, large text (1.5x)
// Timer: 120px, teal ring, 48px bold center
// Mic: 64px, idle white outline, listening teal pulse
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, Check, Mic, MicOff, Volume2, VolumeX,
  MessageCircle, Send, ChefHat,
} from 'lucide-react';
import { getStepText, getStepDuration, getStepVoiceCue } from '../data/recipes';
import { useSpeech, useVoiceInput } from '../hooks/useVoice';
import { useCookingAssistant } from '../hooks/useRecipes';
import { Spinner } from './Spinner';

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
  const circumference = 2 * Math.PI * 52;
  const isPulsing = remaining > 0 && remaining <= 30 && isRunning;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 120px timer per design system */}
      <div className="relative" style={{ width: '120px', height: '120px' }}>
        <svg className="-rotate-90" style={{ width: '120px', height: '120px' }} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <circle cx="60" cy="60" r="52" fill="none"
            stroke="#2ABFBF"
            strokeWidth="4" strokeLinecap="round" className="timer-ring"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (progress / 100) * circumference,
              opacity: isPulsing ? undefined : 1,
            }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${isPulsing ? 'animate-pulse-soft' : ''}`}>
          {remaining === 0 ? (
            <Check size={36} style={{ color: '#2ABFBF' }} />
          ) : (
            <span style={{ fontSize: '48px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'monospace' }}>
              {formatTime(remaining)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setRemaining(duration); setIsRunning(false); }}
          aria-label="Återställ timer"
          className="p-2.5 rounded-full transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          aria-label={isRunning ? 'Pausa' : 'Starta'}
          className="p-3.5 rounded-full text-white transition-all"
          style={{ background: '#2ABFBF', boxShadow: '0 4px 24px rgba(42,191,191,0.25)' }}
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

      {/* Progress bar at top — design system: horizontal progress */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
        <motion.div
          style={{ height: '100%', background: '#2ABFBF', borderRadius: '2px' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Top bar — dark theme */}
      <div className="flex items-center justify-between px-6 py-4"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center"
               style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
            <ChefHat size={17} style={{ color: '#2ABFBF' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{recipe.title}</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Matlagningsläge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeech(); }}
            aria-label={voiceEnabled ? 'Stäng av röst' : 'Aktivera röst'}
            className="p-2 rounded-xl transition-all"
            style={{
              background: voiceEnabled ? 'rgba(42,191,191,0.15)' : 'transparent',
              color: voiceEnabled ? '#2ABFBF' : 'rgba(255,255,255,0.5)',
            }}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            aria-label="Chatt med AI-kock"
            className="p-2 rounded-xl transition-all relative"
            style={{
              background: showChat ? 'rgba(42,191,191,0.15)' : 'transparent',
              color: showChat ? '#2ABFBF' : 'rgba(255,255,255,0.5)',
            }}
          >
            <MessageCircle size={18} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center"
                    style={{ width: '16px', height: '16px', borderRadius: '9999px', background: '#FF7A50', color: '#FFF', fontSize: '9px', fontWeight: '700' }}>
                {messages.filter((m) => m.role === 'assistant').length}
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            aria-label="Stäng matlagningsläge"
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full
                        transition-all duration-300 ${showChat ? 'lg:max-w-xl' : ''}`}>
          {/* Step indicator dots — design system colors */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentStep(idx)}
                aria-label={`Steg ${idx + 1}`}
                className="rounded-full transition-all duration-300 hover:scale-150"
                style={{
                  width: '12px',
                  height: '12px',
                  background: idx === currentStep
                    ? '#2ABFBF'
                    : completedSteps.has(idx)
                      ? '#2ABFBF'
                      : 'rgba(255,255,255,0.2)',
                  boxShadow: idx === currentStep ? '0 0 12px rgba(42,191,191,0.4)' : 'none',
                  opacity: idx === currentStep ? 1 : completedSteps.has(idx) ? 0.6 : 1,
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#2ABFBF', marginBottom: '16px' }}>
            Steg {currentStep + 1} av {totalSteps}
          </span>

          {/* Step text — 1.5x normal font = 24px body -> 36px */}
          <AnimatePresence mode="wait">
            <motion.p key={currentStep}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="text-center leading-snug max-w-xl"
              style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.4' }}>
              {stepText}
            </motion.p>
          </AnimatePresence>

          {stepDuration && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10">
              <CountdownTimer key={currentStep} duration={stepDuration}
                onComplete={() => { if (voiceEnabled) speak('Tiden är ute! Gå vidare till nästa steg.'); }} />
            </motion.div>
          )}

          {/* Microphone — 64px, design system §10 */}
          {voiceSupported && (
            <div className="mt-8">
              <button
                onClick={toggleVoiceListening}
                aria-label={isListening ? 'Sluta lyssna' : 'Fråga kocken'}
                className="rounded-full transition-all duration-200"
                style={{
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isListening ? '#2ABFBF' : 'transparent',
                  border: isListening ? '2px solid #2ABFBF' : '2px solid rgba(255,255,255,0.4)',
                  boxShadow: isListening ? '0 0 24px rgba(42,191,191,0.4)' : 'none',
                  color: isListening ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '8px' }}>
                {isListening ? 'Lyssnar...' : 'Fråga kocken'}
              </p>
            </div>
          )}
        </div>

        {/* Chat panel — dark cards */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden"
              style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <ChefHat size={16} style={{ color: '#2ABFBF' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>AI-kockassistent</span>
              </div>

              <div className="flex-1 soft-scroll px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <ChefHat size={32} style={{ color: 'rgba(255,255,255,0.2)' }} className="mx-auto mb-3" />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', maxWidth: '200px', margin: '0 auto' }}>
                      Fråga mig vad som helst om receptet!
                    </p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      background: msg.role === 'user' ? 'rgba(42,191,191,0.2)' : 'rgba(255,255,255,0.1)',
                      color: '#FFFFFF',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2" style={{
                      padding: '10px 14px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '14px',
                    }}>
                      <Spinner size="sm" />
                      <span>Tänker...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChat} className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Fråga kocken..." disabled={chatLoading}
                    className="flex-1 focus:outline-none transition-all duration-200"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()}
                    className="rounded-xl transition-colors disabled:opacity-40"
                    style={{ padding: '10px', background: '#2ABFBF', color: '#FFFFFF' }}
                    aria-label="Skicka meddelande"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation — dark theme */}
      <div className="px-6 py-4 flex items-center justify-between"
           style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={goPrev} disabled={currentStep === 0}
          aria-label="Föregående steg"
          className="flex items-center gap-2 font-medium disabled:opacity-30 transition-colors px-4 py-2.5 rounded-xl"
          style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          <ChevronLeft size={18} /> Föregående
        </button>
        <div className="hidden sm:block" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          {voiceSupported ? 'Röst: "nästa" / "tillbaka" / ställ frågor' : 'Piltangenter / mellanslag'}
        </div>
        {currentStep === totalSteps - 1 ? (
          <button onClick={onClose}
            className="rounded-full font-medium transition-all active:scale-[0.97]"
            style={{ padding: '12px 32px', background: '#2ABFBF', color: '#FFFFFF', fontSize: '14px', boxShadow: '0 4px 24px rgba(42,191,191,0.25)' }}>
            Klar!
          </button>
        ) : (
          <button onClick={goNext}
            className="flex items-center gap-2 rounded-full font-medium transition-all active:scale-[0.97]"
            style={{ padding: '12px 24px', background: '#2ABFBF', color: '#FFFFFF', fontSize: '14px', boxShadow: '0 4px 24px rgba(42,191,191,0.25)' }}>
            Nästa steg <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
