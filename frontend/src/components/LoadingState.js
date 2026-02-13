// ============================================
// LoadingState — Soft UI animated search progress
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { NisseLoader } from './NisseLoader';

const STEPS = [
  { label: 'Analyserar dina ingredienser...', duration: 1500 },
  { label: 'Söker recept på nätet via AI...', duration: 3000 },
  { label: 'Läser och jämför receptkällor...', duration: 2500 },
  { label: 'Anpassar efter ditt hushåll...', duration: 2000 },
  { label: 'Sammanställer resultat...', duration: 1500 },
];

export function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let timeout;

    function advance(step) {
      if (step < STEPS.length - 1) {
        timeout = setTimeout(() => {
          setActiveStep(step + 1);
          advance(step + 1);
        }, STEPS[step].duration);
      }
    }

    advance(0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="text-center py-16 px-6 max-w-md mx-auto">
      <NisseLoader size={56} className="mb-6" />

      <h3 className="font-display text-xl font-bold text-warm-800 tracking-tight mb-2">
        Söker efter perfekta recept...
      </h3>
      <p className="text-sm text-warm-500 mb-8">
        AI:n söker bland riktiga recept på nätet och anpassar dem åt dig.
      </p>

      <div className="card shadow-card p-5 space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 py-2.5 px-3.5 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-sage-50 text-warm-800 font-medium border border-sage-200/50' : ''}
                ${isDone ? 'text-sage-600' : ''}
                ${!isDone && !isActive ? 'text-warm-400' : ''}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                          transition-all duration-300
                  ${isDone ? 'bg-sage-400 text-white shadow-teal-glow' : ''}
                  ${isActive ? 'bg-terra-400 text-white shadow-terra-glow' : ''}
                  ${!isDone && !isActive ? 'bg-cream-300 text-warm-400' : ''}`}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
              </span>
              <span className="text-sm">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
