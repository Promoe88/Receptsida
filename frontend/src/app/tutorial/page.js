// ============================================
// Tutorial / Onboarding — 4-step Nisse introduction
// Native-feel with progress dots and smooth transitions
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import { isApp } from '../../lib/platform';
import { NisseButton } from '../../components/NisseButton';
import {
  ChefHat, MapPin, Shield, ArrowRight, ArrowLeft, Check, Sparkles,
  Search, ShoppingBag, Mic,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-400',
    title: 'Hej! Jag heter Nisse',
    subtitle: 'Din personliga matassistent',
    description:
      'Jag hjälper dig hitta recept, jämföra priser och guida dig till närmaste butik. Låt oss komma igång!',
    illustration: [
      { icon: Search, label: 'Sök recept' },
      { icon: ShoppingBag, label: 'Handla smart' },
      { icon: Mic, label: 'Röststyrt' },
    ],
  },
  {
    id: 'features',
    icon: ChefHat,
    iconBg: 'bg-terra-50',
    iconColor: 'text-terra-400',
    title: 'Vad kan Nisse?',
    subtitle: 'Allt du behöver i köket',
    description: null,
    features: [
      { icon: Search, label: 'Sök recept', desc: 'Hitta recept baserat på ingredienser du har hemma' },
      { icon: ShoppingBag, label: 'Jämför priser', desc: 'Se vilken butik som har billigast ingredienser' },
      { icon: MapPin, label: 'Hitta butiker', desc: 'GPS-guidad vägbeskrivning till närmaste mataffär' },
      { icon: Mic, label: 'Kokassistent', desc: 'Röststyrd steg-för-steg-hjälp när du lagar mat' },
    ],
  },
  {
    id: 'location',
    icon: MapPin,
    iconBg: 'bg-sage-50',
    iconColor: 'text-sage-400',
    title: 'Platsåtkomst',
    subtitle: 'Hitta butiker nära dig',
    description:
      'För att visa närmaste mataffärer och ge dig vägbeskrivningar behöver vi tillgång till din plats. Du kan ändra detta när som helst i inställningarna.',
    consent: 'location',
  },
  {
    id: 'privacy',
    icon: Shield,
    iconBg: 'bg-warm-100',
    iconColor: 'text-warm-600',
    title: 'Din integritet',
    subtitle: 'GDPR-skyddad data',
    description:
      'Vi tar din integritet på allvar. Dina personuppgifter lagras säkert och delas aldrig med tredje part utan ditt samtycke.',
    bullets: [
      'All data krypteras och lagras inom EU',
      'Du kan exportera eller radera all din data när som helst',
      'Vi säljer aldrig dina personuppgifter',
      'Läs vår fullständiga integritetspolicy under Inställningar',
    ],
    consent: 'privacy',
  },
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function TutorialPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [locationGranted, setLocationGranted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  async function handleLocationConsent() {
    setLocationGranted(!locationGranted);
    if (!locationGranted && user) {
      gdpr.recordConsent('LOCATION', true).catch(() => {});
    }
  }

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
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  const canProceed = () => {
    if (current.id === 'privacy') return privacyAccepted;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 safe-top safe-bottom">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Progress dots */}
        <div className="flex justify-center gap-2.5 mb-10">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.id}
              animate={{
                width: i === step ? 32 : 8,
                backgroundColor: i === step ? '#5A7D6C' : i < step ? '#9FBFAE' : '#E8E4DF',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-20 h-20 ${current.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-5`}
              >
                <current.icon size={36} className={current.iconColor} />
              </motion.div>
              <h1 className="font-display text-3xl text-warm-800">{current.title}</h1>
              <p className="text-warm-500 mt-1.5 text-base">{current.subtitle}</p>
            </div>

            {/* Card content */}
            <div className="card p-6">
              {current.description && (
                <p className="text-warm-600 leading-relaxed mb-4 text-[15px]">{current.description}</p>
              )}

              {/* Welcome step: quick illustration pills */}
              {current.illustration && (
                <div className="flex gap-3 mt-2">
                  {current.illustration.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex-1 flex flex-col items-center gap-2 py-4 bg-cream-200/60 rounded-2xl"
                      >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
                          <Icon size={18} className="text-sage-400" />
                        </div>
                        <span className="text-xs font-medium text-warm-600">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Feature list */}
              {current.features && (
                <div className="space-y-3">
                  {current.features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex gap-3 p-3 rounded-2xl bg-cream-200/50"
                      >
                        <div className="w-9 h-9 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-sage-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-warm-800 text-sm">{f.label}</p>
                          <p className="text-warm-500 text-sm">{f.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Bullet points */}
              {current.bullets && (
                <ul className="space-y-2.5 mb-4">
                  {current.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex gap-2.5 text-sm text-warm-600"
                    >
                      <div className="w-5 h-5 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-sage-500" />
                      </div>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Location consent toggle */}
              {current.id === 'location' && (
                <button
                  onClick={handleLocationConsent}
                  className={`w-full mt-4 py-3.5 px-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    locationGranted
                      ? 'border-sage-400 bg-sage-50'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <span className="text-sm font-medium text-warm-700">
                    {locationGranted ? 'Platsåtkomst aktiverad' : 'Aktivera platsåtkomst'}
                  </span>
                  <div className={`w-12 h-7 rounded-full transition-all duration-200 flex items-center ${
                    locationGranted ? 'bg-sage-400 justify-end' : 'bg-warm-200 justify-start'
                  }`}>
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 bg-white rounded-full mx-1 shadow-sm"
                    />
                  </div>
                </button>
              )}

              {/* Privacy consent checkbox */}
              {current.id === 'privacy' && (
                <label className="flex gap-3 mt-4 cursor-pointer items-start">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded accent-sage-400"
                  />
                  <span className="text-sm text-warm-600">
                    Jag har läst och godkänner{' '}
                    <a href="/integritetspolicy" target="_blank" className="text-sage-400 underline font-medium">
                      integritetspolicyn
                    </a>{' '}
                    och samtycker till behandling av mina personuppgifter.
                  </span>
                </label>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 gap-3">
          {step > 0 ? (
            <NisseButton variant="ghost" size="md" onClick={handleBack}>
              <ArrowLeft size={16} /> Tillbaka
            </NisseButton>
          ) : (
            <div />
          )}

          <NisseButton
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {isLast ? (
              <>Kom igång <Check size={16} /></>
            ) : (
              <>Nästa <ArrowRight size={16} /></>
            )}
          </NisseButton>
        </div>

        {/* Skip option */}
        {!isLast && (
          <div className="text-center mt-5">
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
