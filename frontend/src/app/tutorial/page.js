// ============================================
// Tutorial / Onboarding — "Mental Relief" Overhaul
// Focus: Zero Effort, Decision-Free Living, Active Solution
// Tone: Relief-triggering — "Sluta fundera", "Automatiskt", "Löst"
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { useLocation } from '../../hooks/useLocation';
import { gdpr } from '../../lib/api';
import { isApp } from '../../lib/platform';
import {
  ArrowRight, ArrowLeft, Check, Sparkles,
  MapPin, Shield, Loader2, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Design tokens ──
const CHARCOAL = '#0F172A';
const CORAL = '#FF6B35';
const SAGE = '#5A7D6C';

// ── Springs ──
const SPRING = { type: 'spring', stiffness: 260, damping: 22 };
const SPRING_IMPACT = { type: 'spring', stiffness: 400, damping: 25 };
const SPRING_HEAVY = { type: 'spring', stiffness: 300, damping: 28 };

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

// ── Blur-to-focus entrance for Step 2 (clarity from chaos) ──
const blurToFocus = {
  enter: () => ({
    opacity: 0,
    filter: 'blur(20px)',
    scale: 0.92,
  }),
  center: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { ...SPRING_HEAVY, filter: { duration: 0.8, ease: 'easeOut' } },
  },
  exit: (dir) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(6px)',
  }),
};

// ── Decision Chip data (Step 2) ──
const DECISION_CHIPS = [
  { label: 'Matlådor fixade', emoji: '✅' },
  { label: 'Extrapriser hittade', emoji: '💰' },
  { label: 'Barnen mätta', emoji: '👶' },
];

// ── Chip pulse animation ──
const chipVariant = (i) => ({
  hidden: { opacity: 0, y: 30, scale: 0.8, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { ...SPRING_IMPACT, delay: 0.3 + i * 0.12 },
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
// STEP 1 — THE HOOK (Mental Load Relief)
// "Sluta tänka på maten."
// ═══════════════════════════════════════════

function StepHook() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center"
    >
      {/* LARGE Nisse Sparkle — intense glow */}
      <motion.div
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0 }}
        className="relative mb-8"
        style={{ zIndex: 15 }}
      >
        <div
          className="w-28 h-28 rounded-[32px] flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.95)',
            boxShadow: `0 24px 80px rgba(255,107,53,0.25), 0 0 80px rgba(255,107,53,0.15), 0 0 120px rgba(255,107,53,0.08)`,
            border: '1px solid rgba(255,107,53,0.15)',
          }}
        >
          <Sparkles size={52} style={{ color: CORAL }} />
        </div>
        {/* Intense glow ring — pulsing */}
        <motion.div
          className="absolute inset-0 rounded-[32px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, ${CORAL}30 0%, transparent 70%)` }}
        />
        {/* Outer pulse ring */}
        <motion.div
          className="absolute -inset-4 rounded-[40px]"
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.9, 1.3, 1.5],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{ background: `radial-gradient(circle, ${CORAL}15 0%, transparent 60%)` }}
        />
      </motion.div>

      {/* Badge: 100% BESLUTSFRITT */}
      <motion.div
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.08 }}
        className="mb-5"
      >
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em]"
          style={{
            background: `${CORAL}12`,
            color: CORAL,
            border: `1px solid ${CORAL}25`,
            boxShadow: `0 2px 12px ${CORAL}15`,
          }}
        >
          <Zap size={10} /> 100% Beslutsfritt
        </span>
      </motion.div>

      {/* Massive Headline */}
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.15 }}
        className="font-display text-[44px] font-extrabold tracking-tight leading-[1.05] mb-5"
        style={{ color: CHARCOAL }}
      >
        Sluta tänka<br />på maten.
      </motion.h1>

      {/* Subtitle — with orange highlight */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.25 }}
        className="text-[16px] leading-relaxed font-medium max-w-[300px]"
        style={{ color: '#64748B' }}
      >
        <span style={{ color: CORAL, fontWeight: 700 }}>Nisse tar över</span> planeringen.
        Från kylskåpsrens till färdig middagsplan på sekunder.
        Du behöver aldrig mer fråga <em>&quot;vad ska vi äta?&quot;</em>
      </motion.p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// STEP 2 — THE LOGIC (Smart Efficiency)
// "AI som förstår din vardag."
// ═══════════════════════════════════════════

function StepLogic() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center"
    >
      {/* Accent tag */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0 }}
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-3"
        style={{ color: CORAL }}
      >
        Helt automatiskt
      </motion.p>

      {/* Massive Headline */}
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.05 }}
        className="font-display text-[42px] font-extrabold tracking-tight leading-[1.05] mb-5 text-center"
        style={{ color: CHARCOAL }}
      >
        AI som förstår<br />din vardag.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.15 }}
        className="text-[16px] leading-relaxed font-medium max-w-[310px] text-center mb-10"
        style={{ color: '#64748B' }}
      >
        Oavsett om det är barnfamiljspusslet eller lyxmiddag för två –
        Nisse optimerar recepten efter din smak, din tid och din plånbok.{' '}
        <span style={{ color: CORAL, fontWeight: 700 }}>Helt automatiskt.</span>
      </motion.p>

      {/* Floating Decision Chips */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        {DECISION_CHIPS.map((chip, i) => (
          <motion.div
            key={i}
            variants={chipVariant(i)}
            className="flex items-center gap-3 py-4 px-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
            }}
          >
            <motion.span
              className="text-xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            >
              {chip.emoji}
            </motion.span>
            <span className="text-[15px] font-bold" style={{ color: CHARCOAL }}>
              {chip.label}
            </span>
            {/* Pulse dot */}
            <motion.div
              className="ml-auto w-2.5 h-2.5 rounded-full"
              style={{ background: SAGE }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// STEP 3 — THE FREEDOM (Economy & Action)
// "Spara tid och tusenlappar."
// ═══════════════════════════════════════════

function RadarIcon() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto mb-6">
      {/* Radar scanning waves */}
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

function StepFreedom({ locationGranted, locationLoading, locationDenied, onLocationToggle, privacyAccepted, onPrivacyToggle }) {
  const denied = locationDenied && !locationGranted;

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

      {/* Accent tag */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.08 }}
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-3"
        style={{ color: CORAL }}
      >
        Frihet i vardagen
      </motion.p>

      {/* Massive Headline */}
      <motion.h1
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.14 }}
        className="font-display text-[42px] font-extrabold tracking-tight leading-[1.05] mb-3 text-center"
        style={{ color: CHARCOAL }}
      >
        Spara tid och<br /><span style={{ color: CORAL }}>tusenlappar.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={cinematicIn}
        transition={{ ...SPRING, delay: 0.18 }}
        className="text-[15px] leading-relaxed font-medium max-w-[300px] text-center mb-6"
        style={{ color: '#64748B' }}
      >
        Nisse jagar extrapriserna och guidar dig genom butiken.
        När du väl lagar maten, följer du bara rösten.
        Enklare blir det inte.
      </motion.p>

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
        {/* Location button */}
        <motion.button
          onClick={onLocationToggle}
          disabled={locationLoading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-4 rounded-2xl border-2 flex items-center justify-between mb-4 transition-all disabled:opacity-70"
          style={{
            borderColor: locationGranted ? SAGE : denied ? '#EF4444' : '#E2E8F0',
            background: locationGranted ? `${SAGE}08` : denied ? '#FEF2F2' : 'white',
            boxShadow: locationGranted ? `0 0 20px ${SAGE}20` : 'none',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: CHARCOAL }}>
            {locationLoading
              ? 'Begär åtkomst...'
              : locationGranted
                ? 'Platsåtkomst aktiverad'
                : denied
                  ? 'Åtkomst nekad'
                  : 'Aktivera platsåtkomst'}
          </span>
          {locationLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={20} style={{ color: '#94A3B8' }} />
            </motion.div>
          ) : (
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
          )}
        </motion.button>

        {/* Denied hint */}
        <AnimatePresence>
          {denied && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[12px] mb-3 px-1"
              style={{ color: '#EF4444' }}
            >
              Aktivera plats i enhetens inställningar och försök igen.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Privacy bullets */}
        <div className="space-y-2 mb-4">
          {[
            'Din plats används bara för att hitta butiker',
            'Data krypteras och lagras inom EU',
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
// Massive "Easy Button", discreet skip
// ═══════════════════════════════════════════

function NavIsland({ step, isLast, canProceed, onNext, onBack, onSkip }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex justify-center"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="w-[92%] max-w-[420px] rounded-3xl px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left — Back / Skip (very discreet) */}
          <div className="min-w-[72px]">
            {step > 0 ? (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING}
                onClick={onBack}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                style={{ color: '#B0B8C4' }}
              >
                <ArrowLeft size={14} />
                Tillbaka
              </motion.button>
            ) : (
              <button
                onClick={onSkip}
                className="text-[10px] font-medium px-3 py-2.5 transition-colors"
                style={{ color: '#CBD5E1', opacity: 0.5 }}
              >
                Hoppa över
              </button>
            )}
          </div>

          {/* Right — MASSIVE Next / CTA "Easy Button" */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={onNext}
            disabled={!canProceed}
            className="relative flex items-center justify-center gap-2 rounded-2xl text-[15px] font-extrabold
                     overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed flex-1"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              padding: isLast ? '18px 28px' : '16px 32px',
              maxWidth: isLast ? '260px' : '220px',
              boxShadow: isLast && canProceed
                ? '0 10px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)'
                : '0 6px 24px rgba(0,0,0,0.18)',
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 55%, transparent 70%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {isLast ? (
                <>Ge mig mental frihet <ArrowRight size={16} /></>
              ) : (
                <>Nästa <ArrowRight size={15} /></>
              )}
            </span>
          </motion.button>
        </div>

        {/* Skip on middle steps — very discreet */}
        {step > 0 && !isLast && (
          <div className="text-center mt-1.5">
            <button
              onClick={onSkip}
              className="text-[10px] font-medium transition-colors"
              style={{ color: '#CBD5E1', opacity: 0.4 }}
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
  const { hasPosition, loading: locationLoading, denied: locationDenied, requestLocation } = useLocation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const locationGranted = hasPosition;
  const isLast = step === 2;
  const canProceed = step === 2 ? privacyAccepted : true;

  const handleLocationConsent = useCallback(async () => {
    if (locationGranted) return;
    await requestLocation();
    if (user) {
      gdpr.recordConsent('LOCATION', true).catch(() => {});
    }
  }, [locationGranted, requestLocation, user]);

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

      {/* LAYER 10 — Main Content */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center px-7"
        style={{
          paddingTop: 'max(52px, calc(env(safe-area-inset-top) + 52px))',
          paddingBottom: 'max(110px, calc(env(safe-area-inset-bottom) + 110px))',
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
              <StepHook />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              custom={direction}
              variants={blurToFocus}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
              className="w-full max-w-[380px]"
            >
              <StepLogic />
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
              <StepFreedom
                locationGranted={locationGranted}
                locationLoading={locationLoading}
                locationDenied={locationDenied}
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
