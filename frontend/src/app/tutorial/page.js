// ============================================
// Tutorial / Onboarding — Nisse introduktion
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import { gdpr } from '../../lib/api';
import {
  ChefHat, MapPin, Shield, ArrowRight, ArrowLeft, Check, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-500',
    title: 'Hej! Jag heter Nisse',
    subtitle: 'Din personliga matassistent',
    description:
      'Jag hjälper dig hitta recept, jämföra priser och guida dig till närmaste butik. Låt oss komma igång!',
  },
  {
    id: 'features',
    icon: ChefHat,
    iconBg: 'bg-terra-50',
    iconColor: 'text-terra-500',
    title: 'Vad kan Nisse?',
    subtitle: 'Allt du behöver i köket',
    description: null,
    features: [
      { label: 'Sök recept', desc: 'Hitta recept baserat på ingredienser du har hemma' },
      { label: 'Jämför priser', desc: 'Se vilken butik som har billigast ingredienser' },
      { label: 'Hitta butiker', desc: 'GPS-guidad vägbeskrivning till närmaste mataffär' },
      { label: 'Kokassistent', desc: 'Röststyrd steg-för-steg-hjälp när du lagar mat' },
    ],
  },
  {
    id: 'location',
    icon: MapPin,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
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

export default function TutorialPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);
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
      // Record privacy policy consent
      gdpr.recordConsent('PRIVACY_POLICY', true).catch(() => {});
      await completeOnboarding();
    }
    localStorage.setItem('nisse_tutorial_seen', 'true');
    router.push('/');
  }

  function handleNext() {
    if (isLast) {
      handleFinish();
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const canProceed = () => {
    if (current.id === 'privacy') return privacyAccepted;
    return true;
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-sage-400' : i < step ? 'w-2 bg-sage-300' : 'w-2 bg-warm-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Icon */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${current.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                <current.icon size={32} className={current.iconColor} />
              </div>
              <h1 className="font-display text-3xl text-warm-800">{current.title}</h1>
              <p className="text-warm-500 mt-1">{current.subtitle}</p>
            </div>

            <div className="card p-6">
              {current.description && (
                <p className="text-warm-600 leading-relaxed mb-4">{current.description}</p>
              )}

              {/* Feature list */}
              {current.features && (
                <div className="space-y-3">
                  {current.features.map((f, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-2xl bg-cream-200/50">
                      <div className="w-8 h-8 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sage-500 font-bold text-sm">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-warm-800 text-sm">{f.label}</p>
                        <p className="text-warm-500 text-sm">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bullet points */}
              {current.bullets && (
                <ul className="space-y-2 mb-4">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-warm-600">
                      <Check size={16} className="text-sage-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* Location consent toggle */}
              {current.id === 'location' && (
                <button
                  onClick={handleLocationConsent}
                  className={`w-full mt-4 py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    locationGranted
                      ? 'border-sage-400 bg-sage-50'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <span className="text-sm font-medium text-warm-700">
                    {locationGranted ? 'Platsåtkomst aktiverad' : 'Aktivera platsåtkomst'}
                  </span>
                  <div className={`w-12 h-7 rounded-full transition-all flex items-center ${
                    locationGranted ? 'bg-sage-400 justify-end' : 'bg-warm-200 justify-start'
                  }`}>
                    <div className="w-5 h-5 bg-white rounded-full mx-1 shadow-sm" />
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
                    <a href="/integritetspolicy" target="_blank" className="text-sage-500 underline">
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
        <div className="flex justify-between mt-6 gap-3">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Tillbaka
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {isLast ? (
              <>
                Kom igång <Check size={16} />
              </>
            ) : (
              <>
                Nästa <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Skip option */}
        {!isLast && (
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
