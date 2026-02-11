// ============================================
// CookingMode — Full-screen cooking overlay
// Large typography, progress bars, countdown timers
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Timer, Play, Pause,
  RotateCcw, Check, ChefHat,
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
          <circle cx="40" cy="40" r="36" fill="none" stroke="#F3EBD9" strokeWidth="4" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={remaining === 0 ? '#4A7C59' : '#E65F2B'}
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
          <span className="text-2xl font-bold text-cream-800 tabular-nums font-body">
            {remaining === 0 ? (
              <Check size={28} className="text-pine-500" />
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
          className="p-2.5 rounded-xl bg-cream-100 text-cream-500 hover:bg-cream-200 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-3.5 rounded-2xl text-white transition-all
            ${isRunning ? 'bg-cream-400 hover:bg-cream-500' : 'bg-action-400 hover:bg-action-500'}`}
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

  // Handle keyboard navigation
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
      className="cooking-mode flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <ChefHat size={20} className="text-pine-500" />
          <div>
            <h2 className="text-sm font-semibold text-cream-800">{recipe.title}</h2>
            <p className="text-xs text-cream-400">Matlagningsläge</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-cream-100 text-cream-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-cream-100">
        <motion.div
          className="h-full bg-pine-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                ${idx === currentStep
                  ? 'bg-action-400 scale-125'
                  : completedSteps.has(idx)
                    ? 'bg-pine-400'
                    : 'bg-cream-200'
                }`}
            />
          ))}
        </div>

        {/* Step number */}
        <span className="section-label mb-4">
          Steg {currentStep + 1} av {totalSteps}
        </span>

        {/* Step text — large, readable */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl text-cream-800
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
      <div className="border-t border-cream-200 px-6 py-4 flex items-center justify-between
                    bg-white/80 backdrop-blur-md">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-sm font-medium text-cream-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:text-cream-800 transition-colors px-4 py-2.5 rounded-xl"
        >
          <ChevronLeft size={18} />
          Föregående
        </button>

        {currentStep === totalSteps - 1 ? (
          <button
            onClick={onClose}
            className="btn-pine px-8"
          >
            Klar!
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-2 btn-primary px-6"
          >
            Nästa steg
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
