// ============================================
// Tutorial / Onboarding — "Three-Steg-Raket"
// Fixed 100vh native-feel, mesh gradient, pill progress,
// glassmorphism bottom nav, staggered entrances
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

// ── Spring physics ──
const SPRING = { type: 'spring', stiffness: 260, damping: 20 };
const SPRING_TIGHT = { type: 'spring', stiffness: 300, damping: 30 };

// ── Slide variants for AnimatePresence ──
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

// ── Staggered child entrance (0.1s between each) ──
const staggerIn = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const popUp = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: SPRING },
};

// ── Feature card cascade ──
const cardCascade = (i) => ({
  hidden: { opacity: 0, y: 36, scale: 0.93 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING, delay: 0.15 + i * 0.1 },
  },
});

// ── Feature card data (step 2) ──
const FEATURE_CARDS = [
  {
    icon: Search,
    label: 'Sök recept',
    desc: 'Hitta recept baserat på ingredienser du har hemma',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.08)',
    anim: 'pulse',
  },
  {
    icon: Tag,
    label: 'Jämför priser',
    desc: 'Se vilken butik som har billigast ingredienser',
    color: '#5A7D6C',
    bg: 'rgba(90,125,108,0.08)',
    anim: 'tilt',
  },
  {
    icon: MapPin,
    label: 'Hitta butiker',
    desc: 'GPS-guidad vägbeskrivning till närmaste mataffär',
    color: '#2ABFBF',
    bg: 'rgba(42,191,191,0.08)',
    anim: 'float',
  },
  {
    icon: ChefHat,
    label: 'Kokassistent',
    desc: 'Röststyrd steg-för-steg-hjälp när du lagar mat',
    color: '#D97757',
    bg: 'rgba(217,119,87,0.08)',
    anim: 'float',
  },
];

const iconAnims = {
  pulse: { scale: [1, 1.14, 1] },
  tilt: { rotate: [0, -8, 0, 8, 0] },
  float: { y: [0, -4, 0] },
};

// ── Floating Nisse Sparkle ──
function HeroSparkle() {
  return (
    <motion.div
      className="flex justify-center"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          filter: [
            'drop-shadow(0 0 14px rgba(90,125,108,0.15))',
            'drop-shadow(0 0 32px rgba(90,125,108,0.4))',
            'drop-shadow(0 0 14px rgba(90,125,108,0.15))',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="rgba(90,125,108,0.06)" />
          <path
            d="M 32 6 C 34 17, 41 24.5, 54 26.5 C 41 28.5, 34 36, 32 47 C 30 36, 23 28.5, 10 26.5 C 23 24.5, 30 17, 32 6 Z"
            fill="#5A7D6C"
          />
          <path
            d="M 49 10 C 49.6 13, 52 15.5, 55 16 C 52 16.5, 49.6 19, 49 22 C 48.4 19, 46 16.5, 43 16 C 46 15.5, 48.4 13, 49 10 Z"
            fill="#5A7D6C"
            opacity="0.4"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── Pill Progress Bar ──
function PillProgress({ step }) {
  return (
    <div className="flex justify-center items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            width: i === step ? 44 : 10,
            height: 10,
            backgroundColor: i === step ? '#5A7D6C' : i < step ? '#A3C4B5' : '#D4D4D8',
            boxShadow: i === step ? '0 0 16px rgba(90,125,108,0.45)' : '0 0 0 transparent',
          }}
          transition={SPRING}
          className="rounded-full"
        />
      ))}
    </div>
  );
}

// ── Pulse ring for location step ──
function PulseRing() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center mx-auto">
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
        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center relative z-10"
        style={{ boxShadow: '0 12px 40px rgba(90,125,108,0.15)' }}
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
  const canProceed = step === 2 ? privacyAccepted : true;

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

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 10%, rgba(90,125,108,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 80% 90%, rgba(90,125,108,0.06) 0%, transparent 50%),
          linear-gradient(170deg, #F8F8FA 0%, #F0F1F3 40%, #EBEDF0 100%)
        `,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ═══ TOP SECTION — Sparkle + Pill Progress ═══ */}
      <div className="flex flex-col items-center gap-4 pt-10 pb-4 px-6">
        <HeroSparkle />
        <PillProgress step={step} />
      </div>

      {/* ═══ STEP CONTENT — fills remaining space, vertically centered ═══ */}
      <div className="flex-1 flex flex-col justify-center px-6 min-h-0 overflow-y-auto scrollbar-none">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── STEP 1: IDENTITY ─── */}
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
              <motion.div
                variants={staggerIn}
                initial="hidden"
                animate="show"
                className="text-center mb-6"
              >
                {/* Accent label */}
                <motion.p
                  variants={popUp}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: '#5A7D6C' }}
                >
                  Din personliga matassistent
                </motion.p>

                {/* Icon */}
                <motion.div
                  variants={popUp}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5"
                  style={{ boxShadow: '0 16px 48px rgba(90,125,108,0.12)' }}
                >
                  <Sparkles size={36} style={{ color: '#5A7D6C' }} />
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={popUp}
                  className="font-display text-[34px] font-extrabold tracking-tight leading-[1.15]"
                  style={{ color: '#1A1A1A' }}
                >
                  Hej! Jag heter Nisse
                </motion.h1>

                {/* Subtitle */}
                <motion.p variants={popUp} className="text-warm-400 mt-3 text-base font-medium">
                  Jag hjälper dig hitta recept, jämföra priser och guida dig till närmaste butik.
                </motion.p>
              </motion.div>

              {/* Feature boxes with borders + different float speeds */}
              <motion.div
                className="flex gap-3"
                variants={staggerIn}
                initial="hidden"
                animate="show"
              >
                {[
                  { icon: Search, label: 'Sök recept', speed: 2.4 },
                  { icon: ShoppingBag, label: 'Handla smart', speed: 3.0 },
                  { icon: Mic, label: 'Röststyrt', speed: 2.7 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={popUp}
                    className="flex-1 flex flex-col items-center gap-3 py-5 rounded-2xl bg-white"
                    style={{
                      border: '1px solid #E5E5E5',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: item.speed,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                      }}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center"
                      style={{
                        boxShadow: '0 4px 20px rgba(90,125,108,0.1)',
                        border: '1px solid rgba(90,125,108,0.08)',
                      }}
                    >
                      <item.icon size={22} style={{ color: '#5A7D6C' }} />
                    </motion.div>
                    <span className="text-xs font-bold text-warm-700 tracking-wide">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
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
              <motion.div
                variants={staggerIn}
                initial="hidden"
                animate="show"
                className="text-center mb-6"
              >
                <motion.p
                  variants={popUp}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: '#5A7D6C' }}
                >
                  Allt du behöver i köket
                </motion.p>
                <motion.h1
                  variants={popUp}
                  className="font-display text-[34px] font-extrabold tracking-tight leading-[1.15]"
                  style={{ color: '#1A1A1A' }}
                >
                  Vad kan Nisse?
                </motion.h1>
              </motion.div>

              {/* Feature Cards — deep shadows, 1px border, icon animations */}
              <div className="space-y-3">
                {FEATURE_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={cardCascade(i)}
                      initial="hidden"
                      animate="show"
                      className="flex gap-4 p-4 rounded-2xl bg-white relative"
                      style={{
                        border: '1px solid #E5E5E5',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        zIndex: FEATURE_CARDS.length - i,
                      }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: card.bg }}
                        animate={iconAnims[card.anim] || {}}
                        transition={{
                          duration: card.anim === 'pulse' ? 2 : card.anim === 'tilt' ? 3 : 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Icon size={22} style={{ color: card.color }} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px]" style={{ color: '#1A1A1A' }}>{card.label}</p>
                        <p className="text-warm-500 text-sm leading-relaxed mt-0.5">{card.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: TRUST & PRIVACY ─── */}
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
              <motion.div
                variants={staggerIn}
                initial="hidden"
                animate="show"
              >
                {/* Pulse ring */}
                <motion.div variants={popUp}>
                  <PulseRing />
                </motion.div>

                <div className="text-center mt-5 mb-5">
                  <motion.p
                    variants={popUp}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
                    style={{ color: '#5A7D6C' }}
                  >
                    Tryggt och säkert
                  </motion.p>
                  <motion.h1
                    variants={popUp}
                    className="font-display text-[34px] font-extrabold tracking-tight leading-[1.15]"
                    style={{ color: '#1A1A1A' }}
                  >
                    Plats & Integritet
                  </motion.h1>
                  <motion.p variants={popUp} className="text-warm-400 mt-3 text-base font-medium max-w-xs mx-auto">
                    Hitta butiker nära dig — din data krypteras och delas aldrig utan samtycke.
                  </motion.p>
                </div>
              </motion.div>

              {/* Trust card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.3 }}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: '1px solid #E5E5E5',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                }}
              >
                {/* Location toggle */}
                <motion.button
                  onClick={handleLocationConsent}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-5 rounded-2xl border-2 transition-all flex items-center justify-between mb-4"
                  style={{
                    borderColor: locationGranted ? '#5A7D6C' : '#E4E4E7',
                    background: locationGranted ? 'rgba(90,125,108,0.04)' : 'white',
                    boxShadow: locationGranted ? '0 0 24px rgba(90,125,108,0.15)' : 'none',
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
                <div className="space-y-2.5 mb-4">
                  {[
                    'All data krypteras och lagras inom EU',
                    'Exportera eller radera din data när som helst',
                    'Vi säljer aldrig dina personuppgifter',
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING, delay: 0.35 + i * 0.1 }}
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
                <label className="flex gap-3 cursor-pointer items-start p-3.5 rounded-xl bg-cream-100/60 border border-warm-100/50">
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ FIXED BOTTOM NAV — Glassmorphism bar ═══ */}
      <div
        className="flex-shrink-0 px-6 pt-4 pb-6"
        style={{
          background: 'rgba(245,245,247,0.7)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left: Back / Skip */}
          <div style={{ minWidth: 100 }}>
            {step > 0 ? (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING}
                onClick={handleBack}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full text-sm font-medium text-warm-500
                         transition-colors hover:text-warm-700"
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
          </div>

          {/* Right: Next / CTA with shimmer */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!canProceed}
            className="relative flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-bold
                     transition-all disabled:opacity-35 disabled:cursor-not-allowed overflow-hidden"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              boxShadow: isLast && canProceed
                ? '0 12px 40px rgba(0,0,0,0.35)'
                : '0 6px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Shimmer animation — always visible */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 65%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {isLast ? (
                <>Kom igång <Check size={16} /></>
              ) : (
                <>Nästa <ArrowRight size={16} /></>
              )}
            </span>
          </motion.button>
        </div>

        {/* Skip link on middle steps */}
        {step > 0 && !isLast && (
          <div className="text-center mt-3">
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
