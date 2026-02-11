// ============================================
// CookingMode — HUD-style cooking interface
// Dark theme, large typography, countdown timers
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, Check, Terminal,
} from 'lucide-react';

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
      {/* Circle timer */}
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

      {/* Controls */}
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

  const steps = recipe.steps || [];
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, totalSteps]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, onClose]);

  const stepText = typeof step === 'string' ? step : step?.text || '';
  const stepDuration = typeof step === 'object' ? step?.duration : null;

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
            <Terminal size={16} className="text-accent-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">{recipe.title}</h2>
            <p className="text-xs text-zinc-600 font-mono">HUD // Matlagningsläge</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-surface-200 text-zinc-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800">
        <motion.div
          className="h-full bg-accent-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full">
        {/* Step indicator dots */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300
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

        {/* Step text — large HUD typography */}
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
              onComplete={() => {}}
            />
          </motion.div>
        )}
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
          Piltangenter eller mellanslag för att navigera
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
