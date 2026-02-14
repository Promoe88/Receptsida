// ============================================
// Tutorial / Onboarding — "Netflix-Premium" Cinematic Intro
// Fixed 100dvh, z-layer architecture, one-shot impact animations,
// floating glass island nav, radar scanning, materializing sparkle
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import { isApp } from '../../lib/platform';
import {
  ArrowRight, ArrowLeft, Check, Sparkles,
  Search, Tag, MapPin, Shield, ChefHat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Design tokens ──
const CHARCOAL = '#0F172A';
const CORAL = '#FF6B35';
const SAGE = '#5A7D6C';

// ── Springs ──
const SPRING = { type: 'spring', stiffness: 260, damping: 22 };
const SPRING_IMPACT = { type: 'spring', stiffness: 400, damping: 25 };

// ── Cinematic entrance — blur-fade-scale (one-shot) ──
const cinematicIn = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
};

// ── Stagger container ──
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

// ── AnimatePresence slide variants ──
const pageVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (dir) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(6px)',
  }),
};

// ── Feature tiles (step 2) — 2x2 grid ──
const FEATURES = [
  { icon: Search, label: 'Sök recept', desc: 'Baserat på vad du har hemma', accent: CORAL },
  { icon: Tag, label: 'Jämför priser', desc: 'ICA, Willys, Coop & Lidl', accent: SAGE },
  { icon: MapPin, label: 'Hitta butiker', desc: 'GPS-guidad vägbeskrivning', accent: '#2ABFBF' },
  { icon: ChefHat, label: 'Kokassistent', desc: 'Röststyrd steg-för-steg', accent: '#D97757' },
];

// ── Impact entrance for grid tiles (one-shot, no loop) ──
const tileImpact = (i) => ({
  hidden: { opacity: 0, y: 50, scale: 0.85, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { ...SPRING_IMPACT, delay: 0.1 + i * 0.08 },
  },
});

// ═══════════════════════════════════════════
// LAYER 20 — Progress Bar (fixed top)
// ═══════════════════════════════════════════

function ProgressBar({ step }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex justify-center items-center gap-2 pt-3 pb-3"
      style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          layout
          transition={SPRING}
          className="h-[6px] rounded-full"
          style={{
            width: i === step ? 48 : 10,
            backgroundColor: i === step ? CORAL : i < step ? '#FFAA85' : '#D4D4D8',
            boxShadow: i === step ? `0 0 14px ${CORAL}66` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// STEP 1 — The Persona (Materializing AI)
// ═══════════════════════════════════════════

function StepPersona() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center"
    >
      {/* LARGE Nisse Sparkle — materializing from blur */}
      <motion.div
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0 }}
        className="relative mb-8"
        style={{ zIndex: 15 }}
      >
        <div
          className="w-28 h-28 rounded-[32px] flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.9)',
            boxShadow: `0 24px 80px rgba(255,107,53,0.15), 0 0 60px rgba(255,107,53,0.08)`,
            border: '1px solid rgba(255,107,53,0.1)',
          }}
        >
          <Sparkles size={52} style={{ color: CORAL }} />
        </div>
        {/* Glow ring behind sparkle */}
        <motion.div
          className="absolute inset-0 rounded-[32px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.3, 1.5] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ background: `radial-gradient(circle, ${CORAL}20 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Accent tag */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.1 }}
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-4"
        style={{ color: CORAL }}
      >
        Din personliga matassistent
      </motion.p>

      {/* Massive Headline */}
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.2 }}
        className="font-display text-[38px] font-extrabold tracking-tight leading-[1.1] mb-4"
        style={{ color: CHARCOAL }}
      >
        Hej! Jag heter{' '}
        <span style={{ color: CORAL }}>Nisse</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.3 }}
        className="text-[15px] leading-relaxed font-medium max-w-[280px]"
        style={{ color: '#64748B' }}
      >
        Jag hjälper dig hitta recept, jämföra priser och guida dig till närmaste butik.
      </motion.p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// STEP 2 — The Power (2x2 Impact Grid)
// ═══════════════════════════════════════════

function StepPower() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center"
    >
      {/* Header */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0 }}
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-3"
        style={{ color: CORAL }}
      >
        Allt du behöver i köket
      </motion.p>
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.05 }}
        className="font-display text-[36px] font-extrabold tracking-tight leading-[1.1] mb-8 text-center"
        style={{ color: CHARCOAL }}
      >
        Vad kan Nisse?
      </motion.h1>

      {/* 2x2 Glassmorphism Grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={i}
              variants={tileImpact(i)}
              className="flex flex-col items-center text-center gap-2.5 py-5 px-3 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: `${feat.accent}12`,
                  boxShadow: `0 4px 16px ${feat.accent}15`,
                }}
              >
                <Icon size={22} style={{ color: feat.accent }} />
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: CHARCOAL }}>{feat.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>{feat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// STEP 3 — The Trust (Radar Scan + Consent)
// ═══════════════════════════════════════════

function RadarIcon() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto mb-6">
      {/* Radar scanning waves — one-shot burst then subtle repeat */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${CORAL}30` }}
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Core icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ ...SPRING_IMPACT, delay: 0.15 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center relative z-10"
        style={{
          background: 'rgba(255,255,255,0.9)',
          boxShadow: `0 20px 60px ${CORAL}18`,
          border: '1px solid rgba(255,107,53,0.12)',
        }}
      >
        <MapPin size={36} style={{ color: CORAL }} />
      </motion.div>
    </div>
  );
}

function StepTrust({ locationGranted, onLocationToggle, privacyAccepted, onPrivacyToggle }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center"
    >
      {/* Radar icon */}
      <motion.div variants={cinematicIn} transition={{ ...SPRING, delay: 0 }}>
        <RadarIcon />
      </motion.div>

      {/* Heading */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.08 }}
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-3"
        style={{ color: CORAL }}
      >
        Tryggt och säkert
      </motion.p>
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.14 }}
        className="font-display text-[36px] font-extrabold tracking-tight leading-[1.1] mb-6 text-center"
        style={{ color: CHARCOAL }}
      >
        Plats & Integritet
      </motion.h1>

      {/* Trust card */}
      <motion.div
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.22 }}
        className="w-full max-w-[340px] rounded-3xl p-5"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
        }}
      >
        {/* Location toggle */}
        <motion.button
          onClick={onLocationToggle}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-4 rounded-2xl border-2 flex items-center justify-between mb-4 transition-all"
          style={{
            borderColor: locationGranted ? SAGE : '#E2E8F0',
            background: locationGranted ? `${SAGE}08` : 'white',
            boxShadow: locationGranted ? `0 0 20px ${SAGE}20` : 'none',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: CHARCOAL }}>
            {locationGranted ? 'Platsåtkomst aktiverad' : 'Aktivera platsåtkomst'}
          </span>
          <div
            className="w-12 h-7 rounded-full flex items-center transition-all duration-300"
            style={{
              background: locationGranted ? SAGE : '#CBD5E1',
              justifyContent: locationGranted ? 'flex-end' : 'flex-start',
            }}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5.5 h-5.5 bg-white rounded-full mx-1"
              style={{ width: 22, height: 22, boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
            />
          </div>
        </motion.button>

        {/* Privacy bullets */}
        <div className="space-y-2 mb-4">
          {[
            'Data krypteras och lagras inom EU',
            'Exportera eller radera när som helst',
            'Vi säljer aldrig dina uppgifter',
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.35 + i * 0.08 }}
              className="flex items-center gap-2 text-[13px]"
              style={{ color: '#64748B' }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${SAGE}12` }}
              >
                <Shield size={10} style={{ color: SAGE }} />
              </div>
              {text}
            </motion.div>
          ))}
        </div>

        {/* Privacy checkbox */}
        <label
          className="flex gap-3 cursor-pointer items-start p-3 rounded-xl"
          style={{ background: 'rgba(241,245,249,0.6)', border: '1px solid #F1F5F9' }}
        >
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => onPrivacyToggle(e.target.checked)}
              className="sr-only"
            />
            <motion.div
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
              animate={{
                borderColor: privacyAccepted ? SAGE : '#CBD5E1',
                backgroundColor: privacyAccepted ? SAGE : 'transparent',
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
          <span className="text-[13px] leading-relaxed" style={{ color: '#475569' }}>
            Jag godkänner{' '}
            <a href="/integritetspolicy" target="_blank" style={{ color: SAGE }} className="underline font-medium">
              integritetspolicyn
            </a>{' '}
            och samtycker till behandling av mina personuppgifter.
          </span>
        </label>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// LAYER 30 — Glass Navigation Island
// ═══════════════════════════════════════════

function NavIsland({ step, isLast, canProceed, onNext, onBack, onSkip }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex justify-center"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="w-[90%] max-w-[400px] rounded-3xl px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left — Back / Skip */}
          <div className="min-w-[80px]">
            {step > 0 ? (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING}
                onClick={onBack}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                style={{ color: '#94A3B8' }}
              >
                <ArrowLeft size={14} />
                Tillbaka
              </motion.button>
            ) : (
              <button
                onClick={onSkip}
                className="text-[11px] font-medium px-3 py-2.5 transition-colors"
                style={{ color: '#94A3B8' }}
              >
                Hoppa över
              </button>
            )}
          </div>

          {/* Right — Next / CTA */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={!canProceed}
            className="relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-bold
                     overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed flex-1 max-w-[200px]"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              boxShadow: isLast && canProceed
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {isLast ? (
                <>Kom igång <Check size={15} /></>
              ) : (
                <>Nästa <ArrowRight size={15} /></>
              )}
            </span>
          </motion.button>
        </div>

        {/* Skip on middle steps */}
        {step > 0 && !isLast && (
          <div className="text-center mt-1.5">
            <button
              onClick={onSkip}
              className="text-[10px] font-medium transition-colors"
              style={{ color: '#CBD5E1' }}
            >
              Hoppa över introduktionen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════

export default function TutorialPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [locationGranted, setLocationGranted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const isLast = step === 2;
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
      className="relative h-[100dvh] overflow-hidden"
      style={{
        // LAYER 0 — Mesh gradient background
        background: `
          radial-gradient(ellipse 90% 70% at 15% 5%, rgba(255,107,53,0.06) 0%, transparent 50%),
          radial-gradient(ellipse 80% 60% at 85% 80%, rgba(90,125,108,0.06) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,107,53,0.03) 0%, transparent 60%),
          linear-gradient(175deg, #FAFBFC 0%, #F1F3F5 35%, #EBEDF0 70%, #E8EAED 100%)
        `,
      }}
    >
      {/* LAYER 20 — Progress Bar */}
      <ProgressBar step={step} />

      {/* LAYER 10 — Main Content (centered, padded for header + footer) */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center px-7"
        style={{
          // 52px header + 100px footer island = safe content zone
          paddingTop: 'max(52px, calc(env(safe-area-inset-top) + 52px))',
          paddingBottom: 'max(100px, calc(env(safe-area-inset-bottom) + 100px))',
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="s0"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
              className="w-full max-w-[380px]"
            >
              <StepPersona />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
              className="w-full max-w-[380px]"
            >
              <StepPower />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
              className="w-full max-w-[380px]"
            >
              <StepTrust
                locationGranted={locationGranted}
                onLocationToggle={handleLocationConsent}
                privacyAccepted={privacyAccepted}
                onPrivacyToggle={setPrivacyAccepted}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LAYER 30 — Glass Navigation Island */}
      <NavIsland
        step={step}
        isLast={isLast}
        canProceed={canProceed}
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleFinish}
      />
    </div>
  );
}
