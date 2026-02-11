// ============================================
// LoadingState — Dark theme animated search progress
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';

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
    <div className="text-center py-16 px-6 max-w-md mx-auto animate-fade-in">
      <Loader2 size={48} className="text-accent-400 animate-spin mx-auto mb-6" />

      <h3 className="font-display text-xl text-zinc-100 mb-2">
        Söker efter perfekta recept...
      </h3>
      <p className="text-sm text-zinc-500 mb-8">
        AI:n söker bland riktiga recept på nätet och anpassar dem åt dig.
      </p>

      <div className="space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300
                ${isActive ? 'bg-accent-400/10 text-zinc-200 font-medium border border-accent-400/20' : ''}
                ${isDone ? 'text-emerald-400' : ''}
                ${!isDone && !isActive ? 'text-zinc-600' : ''}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0
                          transition-all duration-300
                  ${isDone ? 'bg-emerald-500 text-void' : ''}
                  ${isActive ? 'bg-accent-400 text-void' : ''}
                  ${!isDone && !isActive ? 'bg-zinc-800 text-zinc-600' : ''}`}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
              </span>
              <span className="text-sm font-mono">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
