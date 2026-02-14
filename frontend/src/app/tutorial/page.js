// ============================================
// Tutorial / Onboarding — 3-step "rocket" introduction
// High-energy animated flow with premium motion design
// Step 1: Identity — Step 2: Value — Step 3: Trust
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import { isApp } from '../../lib/platform';
import {
  ArrowRight, ArrowLeft, Check, Sparkles,
  Search, ShoppingBag, Mic, MapPin, Shield,
  Tag, ChefHat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Spring physics — high-end iOS native feel ──
const SPRING = { type: 'spring', stiffness: 260, damping: 20 };
const SPRING_TIGHT = { type: 'spring', stiffness: 300, damping: 30 };

// ── Slide variants ──
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0, scale: 0.96 }),
};

// ── Stagger container ──
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

// ── Feature card float animation ──
const floatVariant = (i) => ({
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING, delay: 0.2 + i * 0.2 },
  },
});

// ── Feature card data for step 2 ──
const FEATURE_CARDS = [
  {
    icon: Search,
    label: 'Sök recept',
    desc: 'Hitta recept baserat på ingredienser du har hemma',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.08)',
    pulse: true,
  },
  {
    icon: Tag,
    label: 'Jämför priser',
    desc: 'Se vilken butik som har billigast ingredienser',
    color: '#5A7D6C',
    bg: 'rgba(90,125,108,0.08)',
    tilt: true,
  },
  {
    icon: MapPin,
    label: 'Hitta butiker',
    desc: 'GPS-guidad vägbeskrivning till närmaste mataffär',
    color: '#2ABFBF',
    bg: 'rgba(42,191,191,0.08)',
  },
  {
    icon: ChefHat,
    label: 'Kokassistent',
    desc: 'Röststyrd steg-för-steg-hjälp när du lagar mat',
    color: '#D97757',
    bg: 'rgba(217,119,87,0.08)',
  },
];

// ── Nisse Sparkle (hero icon) ──
function HeroSparkle({ step }) {
  return (
    <motion.div
      className="flex justify-center mb-6"
      animate={{
        y: [0, -6, 0],
        x: step === 0 ? 0 : step === 1 ? -8 : 8,
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        x: { ...SPRING_TIGHT },
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          filter: [
            'drop-shadow(0 0 12px rgba(255,107,53,0.2))',
            'drop-shadow(0 0 28px rgba(255,107,53,0.45))',
            'drop-shadow(0 0 12px rgba(255,107,53,0.2))',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="rgba(255,107,53,0.06)" />
          <path
            d="M 32 6 C 34 17, 41 24.5, 54 26.5 C 41 28.5, 34 36, 32 47 C 30 36, 23 28.5, 10 26.5 C 23 24.5, 30 17, 32 6 Z"
            fill="#FF6B35"
          />
          <path
            d="M 49 10 C 49.6 13, 52 15.5, 55 16 C 52 16.5, 49.6 19, 49 22 C 48.4 19, 46 16.5, 43 16 C 46 15.5, 48.4 13, 49 10 Z"
            fill="#FF6B35"
            opacity="0.45"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── Pulse ring for location step ──
function PulseRing() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center mx-auto mb-5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-sage-400/30"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="w-20 h-20 bg-sage-50 rounded-3xl flex items-center justify-center shadow-soft relative z-10"
      >
        <MapPin size={36} className="text-sage-400" />
      </motion.div>
    </div>
  );
}

// ── Main component ──

export default function TutorialPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [locationGranted, setLocationGranted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const totalSteps = 3;
  const isLast = step === totalSteps - 1;

  const handleLocationConsent = useCallback(() => {
    setLocationGranted((prev) => {
      const next = !prev;
      if (next && user) {
        gdpr.recordConsent('LOCATION', true).catch(() => {});
      }
      return next;
    });
  }, [user]);

  async function handleFinish() {
    if (user) {
      gdpr.recordConsent('PRIVACY_POLICY', true).catch(() => {});
      await completeOnboarding();
    }
    localStorage.setItem('nisse_tutorial_seen', 'true');
    if (isApp && !user) {
      router.push('/login');
    } else {
      router.push('/');
    }
  }

  function handleNext() {
    if (isLast) {
      handleFinish();
    } else {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }

  const canProceed = step === 2 ? privacyAccepted : true;

  return (
    <div
      className="flex-1 flex flex-col min-h-screen"
      style={{ background: 'linear-gradient(180deg, #F5F5F7 0%, #EBEDF0 100%)' }}
    >
      {/* ═══ GUIDING SPARKLE — floats at top with parallax ═══ */}
      <div className="pt-14 pb-2">
        <HeroSparkle step={step} />

        {/* ═══ PROGRESS DOTS — pill-shaped active with glow ═══ */}
        <div className="flex justify-center gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 36 : 8,
                backgroundColor: i === step ? '#FF6B35' : i < step ? '#FFB899' : '#D4D4D8',
                boxShadow: i === step ? '0 0 12px rgba(255,107,53,0.4)' : '0 0 0 transparent',
              }}
              transition={SPRING}
              className="h-2 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* ═══ STEP CONTENT ═══ */}
      <div className="flex-1 flex flex-col justify-center px-5 pb-4">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── STEP 1: IDENTITY & MAGIC ─── */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
            >
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.05 }}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5"
                  style={{ boxShadow: '0 8px 32px rgba(255,107,53,0.12)' }}
                >
                  <Sparkles size={36} className="text-[#FF6B35]" />
                </motion.div>
                <h1
                  className="font-display text-[32px] font-extrabold tracking-tight leading-tight"
                  style={{ color: '#111111' }}
                >
                  Hej! Jag heter Nisse
                </h1>
                <p className="text-warm-400 mt-2 text-base font-medium">
                  Din personliga matassistent
                </p>
              </div>

              <div className="card p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
                <p className="text-warm-600 leading-relaxed mb-5 text-[15px]">
                  Jag hjälper dig hitta recept, jämföra priser och guida dig till närmaste butik. Låt oss komma igång!
                </p>

                {/* Feature boxes — staggered float-in + hover-float */}
                <motion.div
                  className="flex gap-3"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  {[
                    { icon: Search, label: 'Sök recept' },
                    { icon: ShoppingBag, label: 'Handla smart' },
                    { icon: Mic, label: 'Röststyrt' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="flex-1 flex flex-col items-center gap-2.5 py-5 rounded-2xl"
                      style={{ background: 'rgba(245,245,247,0.8)' }}
                    >
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.4,
                        }}
                        className="w-11 h-11 bg-white rounded-xl flex items-center justify-center"
                        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                      >
                        <item.icon size={20} className="text-sage-400" />
                      </motion.div>
                      <span className="text-xs font-semibold text-warm-600">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: VALUE & PROOF ─── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
            >
              <div className="text-center mb-7">
                <h1
                  className="font-display text-[32px] font-extrabold tracking-tight leading-tight"
                  style={{ color: '#111111' }}
                >
                  Vad kan Nisse?
                </h1>
                <p className="text-warm-400 mt-2 text-base font-medium">
                  Allt du behöver i köket
                </p>
              </div>

              {/* Dynamic Feature Cards — slide-up with overlap depth */}
              <div className="space-y-3">
                {FEATURE_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={floatVariant(i)}
                      initial="hidden"
                      animate="show"
                      className="flex gap-4 p-4 rounded-2xl bg-white border border-warm-100/60 relative"
                      style={{
                        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                        zIndex: FEATURE_CARDS.length - i,
                      }}
                    >
                      <motion.div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: card.bg }}
                        animate={
                          card.pulse
                            ? { scale: [1, 1.12, 1] }
                            : card.tilt
                              ? { rotate: [0, -8, 0, 8, 0] }
                              : {}
                        }
                        transition={{
                          duration: card.pulse ? 2 : 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Icon size={20} style={{ color: card.color }} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-warm-800 text-[15px]">{card.label}</p>
                        <p className="text-warm-500 text-sm leading-relaxed mt-0.5">{card.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: TRUST & ACTION ─── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
            >
              {/* Location with pulse ring */}
              <PulseRing />

              <div className="text-center mb-6">
                <h1
                  className="font-display text-[32px] font-extrabold tracking-tight leading-tight"
                  style={{ color: '#111111' }}
                >
                  Plats & Integritet
                </h1>
                <p className="text-warm-400 mt-2 text-base font-medium">
                  Hitta butiker nära dig — tryggt och säkert
                </p>
              </div>

              <div className="card p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
                <p className="text-warm-600 leading-relaxed text-[15px] mb-5">
                  För att visa närmaste mataffärer behöver vi din plats. Din data krypteras och delas aldrig utan samtycke.
                </p>

                {/* Location toggle — tactile with glow */}
                <motion.button
                  onClick={handleLocationConsent}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-5 rounded-2xl border-2 transition-all flex items-center justify-between mb-5"
                  style={{
                    borderColor: locationGranted ? '#5A7D6C' : '#E4E4E7',
                    background: locationGranted ? 'rgba(90,125,108,0.04)' : 'white',
                    boxShadow: locationGranted ? '0 0 20px rgba(90,125,108,0.15)' : 'none',
                  }}
                >
                  <span className="text-sm font-semibold text-warm-700">
                    {locationGranted ? 'Platsåtkomst aktiverad' : 'Aktivera platsåtkomst'}
                  </span>
                  <div
                    className="w-14 h-8 rounded-full flex items-center transition-all duration-300"
                    style={{
                      background: locationGranted ? '#5A7D6C' : '#D4D4D8',
                      justifyContent: locationGranted ? 'flex-end' : 'flex-start',
                      boxShadow: locationGranted ? '0 0 16px rgba(90,125,108,0.3)' : 'none',
                    }}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-6 h-6 bg-white rounded-full mx-1"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    />
                  </div>
                </motion.button>

                {/* Privacy bullets */}
                <div className="space-y-2.5 mb-5">
                  {[
                    'All data krypteras och lagras inom EU',
                    'Exportera eller radera din data när som helst',
                    'Vi säljer aldrig dina personuppgifter',
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING, delay: 0.3 + i * 0.1 }}
                      className="flex gap-2.5 text-sm text-warm-600"
                    >
                      <div className="w-5 h-5 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield size={10} className="text-sage-500" />
                      </div>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Privacy consent checkbox */}
                <label className="flex gap-3 cursor-pointer items-start p-3 rounded-xl bg-cream-100/60">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
                      animate={{
                        borderColor: privacyAccepted ? '#5A7D6C' : '#D4D4D8',
                        backgroundColor: privacyAccepted ? '#5A7D6C' : 'transparent',
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      <AnimatePresence>
                        {privacyAccepted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <Check size={12} className="text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <span className="text-sm text-warm-600 leading-relaxed">
                    Jag har läst och godkänner{' '}
                    <a href="/integritetspolicy" target="_blank" className="text-sage-500 underline font-medium">
                      integritetspolicyn
                    </a>{' '}
                    och samtycker till behandling av mina personuppgifter.
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ NAVIGATION — fixed bottom bar ═══ */}
      <div className="px-5 pb-8 pt-3">
        <div className="flex items-center justify-between">
          {/* Back button */}
          {step > 0 ? (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={SPRING}
              onClick={handleBack}
              className="flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-medium text-warm-500
                       active:scale-95 transition-transform"
            >
              <ArrowLeft size={16} />
              Tillbaka
            </motion.button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-xs text-warm-400 hover:text-warm-600 transition-colors px-3 py-3"
            >
              Hoppa över
            </button>
          )}

          {/* Next / CTA button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleNext}
            disabled={!canProceed}
            className="relative flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold
                     transition-all disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
            style={{
              background: isLast && canProceed ? '#111111' : '#1A1A1A',
              color: '#FFFFFF',
              boxShadow: isLast && canProceed
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {/* Shimmer effect on final CTA */}
            {isLast && canProceed && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isLast ? (
                <>Kom igång <Check size={16} /></>
              ) : (
                <>Nästa <ArrowRight size={16} /></>
              )}
            </span>
          </motion.button>
        </div>

        {/* Skip on other steps */}
        {step > 0 && !isLast && (
          <div className="text-center mt-4">
            <button
              onClick={handleFinish}
              className="text-xs text-warm-400 hover:text-warm-600 transition-colors"
            >
              Hoppa över introduktionen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
