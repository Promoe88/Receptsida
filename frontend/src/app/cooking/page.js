'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ChevronLeft, ChevronRight, ChefHat } from 'lucide-react';

// ──────────────────────────────────────────
// Dummy recipe for testing (4 steps)
// ──────────────────────────────────────────

const DUMMY_RECIPE = {
  title: 'Krämig kycklingpasta',
  servings: 2,
  time_minutes: 30,
  ingredients: [
    { name: 'Kycklingfilé', amount: '300g' },
    { name: 'Penne pasta', amount: '200g' },
    { name: 'Grädde', amount: '2 dl' },
    { name: 'Vitlök', amount: '2 klyftor' },
    { name: 'Soltorkade tomater', amount: '50g' },
    { name: 'Parmesan', amount: '50g' },
    { name: 'Salt och peppar', amount: 'efter smak' },
  ],
  steps: [
    {
      text: 'Koka upp saltat vatten och tillaga pastan enligt förpackningens anvisningar.',
      voice_cue: 'Börja med att sätta på en stor kastrull med vatten. Salta ordentligt och koka upp. Lägg i pastan när vattnet bubblar.',
      duration_seconds: 600,
    },
    {
      text: 'Skär kycklingen i strimlor och stek i olivolja på hög värme tills den är gyllene.',
      voice_cue: 'Medan pastan kokar, skär kycklingen i tunna strimlor. Hetta upp lite olja i en stekpanna och stek kycklingen tills den fått fin färg, ungefär fyra till fem minuter.',
      duration_seconds: 300,
    },
    {
      text: 'Sänk värmen, tillsätt hackad vitlök och soltorkade tomater. Fräs i en minut.',
      voice_cue: 'Sänk värmen lite. Hacka vitlöken fint och skär tomaterna i bitar. Lägg i dem i pannan och rör runt i ungefär en minut tills det doftar gott.',
      duration_seconds: 60,
    },
    {
      text: 'Häll i grädden, rör ner pastan och avsluta med riven parmesan. Smaka av med salt och peppar.',
      voice_cue: 'Häll i grädden och låt den puttra i någon minut. Häll över den kokta pastan och rör om. Avsluta med parmesan, salt och peppar. Klart att servera!',
      duration_seconds: 120,
    },
  ],
};

// ──────────────────────────────────────────
// CookingPage component
// ──────────────────────────────────────────

export default function CookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const recipe = DUMMY_RECIPE;
  const totalSteps = recipe.steps.length;
  const step = recipe.steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function handlePrev() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  }

  function handleMicToggle() {
    setIsListening(!isListening);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#1A1A2E', color: '#FFFFFF' }}
    >
      {/* ── Header ── */}
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ChefHat size={20} style={{ color: '#2DD4BF' }} />
            <h1 className="text-lg font-semibold truncate">{recipe.title}</h1>
          </div>
          <span className="text-sm opacity-60">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div
          className="w-full h-2 rounded-full overflow-hidden mt-3"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#2DD4BF' }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </header>

      {/* ── Step content (centered) ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-lg"
          >
            <p className="text-2xl sm:text-3xl font-medium leading-relaxed">
              {step.voice_cue}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ── Step navigation ── */}
        <div className="flex items-center gap-8 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-3 rounded-full transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.1)',
              opacity: currentStep === 0 ? 0.3 : 1,
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            className="p-3 rounded-full transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.1)',
              opacity: currentStep === totalSteps - 1 ? 0.3 : 1,
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      {/* ── Mic button (bottom) ── */}
      <footer className="flex justify-center pb-10 pt-4">
        <motion.button
          onClick={handleMicToggle}
          whileTap={{ scale: 0.92 }}
          animate={isListening ? { scale: [1, 1.08, 1] } : {}}
          transition={
            isListening
              ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              : {}
          }
          className="flex items-center justify-center rounded-full"
          style={{
            width: 64,
            height: 64,
            background: isListening ? '#14B8A6' : '#2DD4BF',
            boxShadow: isListening
              ? '0 0 24px rgba(45,212,191,0.5)'
              : '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <Mic size={28} color="#1A1A2E" />
        </motion.button>
      </footer>
    </div>
  );
}
