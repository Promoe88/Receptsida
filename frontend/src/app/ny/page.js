// ============================================
// Veckoplanering — AI Weekly Meal Planner
// Mobile-first, warm Scandinavian, #FF6B35 accent
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronRight, RefreshCw, Lock, Unlock,
  ShoppingCart, Sparkles, ChevronDown, ChevronUp, Lightbulb, X,
  Utensils, Clock, Users,
} from 'lucide-react';
import { isApp } from '../../lib/platform';
import { useAuthStore } from '../../lib/store';
import { useMealPlan } from '../../hooks/useRecipes';
import { AppPageHeader } from '../../components/app/AppPageHeader';
import Link from 'next/link';

// ── Swedish day names ──
const DAY_NAMES = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
const DAY_NAMES_FULL = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

// ── Dietary options ──
const DIETARY_OPTIONS = [
  { id: 'vegetarisk', label: 'Vegetarisk' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenfri', label: 'Glutenfri' },
  { id: 'laktosfri', label: 'Laktosfri' },
  { id: 'lchf', label: 'LCHF' },
];

// ── Helpers ──
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const opts = { day: 'numeric', month: 'short' };
  return `${monday.toLocaleDateString('sv-SE', opts)} – ${sunday.toLocaleDateString('sv-SE', opts)}`;
}

function formatISO(date) {
  return date.toISOString().split('T')[0];
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// ── Spring animations ──
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

// ── Component ──

export default function VeckoplanerPage() {
  const { user, loading: authLoading } = useAuthStore();
  const {
    plans, currentPlan, shoppingList, weeklyTip, totalCost,
    loading, generating, error,
    loadPlans, generate, swapMeal, toggleLock,
  } = useMealPlan();

  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [showGenerate, setShowGenerate] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [householdSize, setHouseholdSize] = useState(user?.householdSize || 2);
  const [dietary, setDietary] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState('dinner');
  const [swapping, setSwapping] = useState(null);
  const dayScrollRef = useRef(null);

  // Load plans on mount
  useEffect(() => {
    if (user) loadPlans();
  }, [user, loadPlans]);

  // Update household size from user
  useEffect(() => {
    if (user?.householdSize) setHouseholdSize(user.householdSize);
  }, [user]);

  // ── Week navigation ──
  const prevWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const nextWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  // ── Generate meal plan ──
  const handleGenerate = useCallback(async () => {
    try {
      await import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
        Haptics.impact({ style: ImpactStyle.Medium });
      }).catch(() => {});

      await generate(formatISO(weekStart), householdSize, {
        dietary: dietary.length > 0 ? dietary : undefined,
        mealsPerDay,
      });
      setShowGenerate(false);
    } catch {
      // Error is handled in the hook
    }
  }, [weekStart, householdSize, dietary, mealsPerDay, generate]);

  // ── Swap a meal ──
  const handleSwap = useCallback(async (dayIndex, mealType) => {
    setSwapping(`${dayIndex}-${mealType}`);
    try {
      await import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
        Haptics.impact({ style: ImpactStyle.Light });
      }).catch(() => {});
      await swapMeal(dayIndex, mealType);
    } finally {
      setSwapping(null);
    }
  }, [swapMeal]);

  // ── Toggle lock ──
  const handleToggleLock = useCallback(async (meal) => {
    try {
      await import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
        Haptics.impact({ style: ImpactStyle.Light });
      }).catch(() => {});
      await toggleLock(meal.id, !meal.locked);
    } catch {
      // Silently fail
    }
  }, [toggleLock]);

  // ── Get meals for selected day ──
  const dayMeals = currentPlan?.meals?.filter((m) => m.dayIndex === selectedDay) || [];

  // ── Auth guard ──
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#EBEDF0' }}>
        <div className="w-12 h-12 rounded-full border-2 border-warm-200 border-t-[#FF6B35] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AppPageHeader title="Veckomeny" />
        <div className="h-full flex flex-col items-center justify-center px-6" style={{ background: '#EBEDF0' }}>
          <Calendar size={48} style={{ color: '#C7C7CC' }} className="mb-4" />
          <h2 className="font-display text-2xl text-warm-800 mb-2 text-center">Logga in för veckomeny</h2>
          <p className="text-warm-500 text-center mb-6 max-w-[260px]">
            Skapa ett konto för att generera personliga veckomenyer med AI.
          </p>
          <Link href="/login?redirect=/ny" className="btn-primary inline-block">
            Logga in
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AppPageHeader title="Veckomeny" />
      <div className="h-full flex flex-col" style={{ background: '#EBEDF0' }}>

        {/* ═══ WEEK SELECTOR ═══ */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <button onClick={prevWeek} className="w-9 h-9 rounded-full flex items-center justify-center bg-white"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E5EA' }}>
              <ChevronLeft size={18} style={{ color: '#48484A' }} />
            </button>

            <div className="text-center">
              <p className="font-display text-[18px] font-bold" style={{ color: '#1A1A1A' }}>
                Vecka {getWeekNumber(weekStart)}
              </p>
              <p className="text-[12px] text-warm-400 font-body">
                {formatWeekRange(weekStart)}
              </p>
            </div>

            <button onClick={nextWeek} className="w-9 h-9 rounded-full flex items-center justify-center bg-white"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E5EA' }}>
              <ChevronRight size={18} style={{ color: '#48484A' }} />
            </button>
          </div>
        </div>

        {/* ═══ DAY TABS ═══ */}
        <div className="px-4 pb-3">
          <div ref={dayScrollRef} className="flex gap-1.5 soft-scroll-x py-1">
            {DAY_NAMES.map((name, i) => {
              const active = selectedDay === i;
              const date = new Date(weekStart);
              date.setDate(date.getDate() + i);
              const isToday = formatISO(date) === formatISO(new Date());
              const hasMeals = currentPlan?.meals?.some((m) => m.dayIndex === i);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-200 flex-1 min-w-[46px]"
                  style={{
                    background: active ? '#FF6B35' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#48484A',
                    boxShadow: active
                      ? '0 6px 20px rgba(255,107,53,0.3)'
                      : '0 2px 6px rgba(0,0,0,0.04)',
                    border: isToday && !active ? '1.5px solid #FF6B35' : '1px solid transparent',
                  }}
                >
                  <span className="text-[10px] font-medium opacity-70">{name}</span>
                  <span className="text-[16px] font-bold">{date.getDate()}</span>
                  {hasMeals && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: active ? '#FFFFFF' : '#FF6B35' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ CONTENT AREA ═══ */}
        <div className="flex-1 overflow-y-auto soft-scroll px-4 pb-32">
          <AnimatePresence mode="wait">
            {!currentPlan ? (
              /* ── Empty state ── */
              <motion.div
                key="empty"
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div variants={fadeUp}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ background: 'rgba(255,107,53,0.08)' }}>
                    <Sparkles size={32} style={{ color: '#FF6B35' }} />
                  </div>
                </motion.div>

                <motion.h2 variants={fadeUp} className="font-display text-[22px] font-bold text-center mb-2"
                  style={{ color: '#1A1A1A' }}>
                  Skapa din veckomeny
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[14px] text-warm-400 text-center max-w-[260px] mb-8 font-body">
                  Nisse skapar en personlig veckomeny baserad på dina preferenser — med inköpslista.
                </motion.p>

                <motion.button
                  variants={fadeUp}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowGenerate(true)}
                  className="execute-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                           font-body font-semibold text-[15px] text-white"
                  style={{
                    background: '#FF6B35',
                    boxShadow: '0 8px 32px rgba(255,107,53,0.35)',
                  }}
                >
                  <Sparkles size={18} strokeWidth={2} />
                  Generera veckomeny
                </motion.button>
              </motion.div>
            ) : (
              /* ── Plan view ── */
              <motion.div
                key={`plan-day-${selectedDay}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-3 mt-1">
                  <h2 className="font-display text-[20px] font-bold" style={{ color: '#1A1A1A' }}>
                    {DAY_NAMES_FULL[selectedDay]}
                  </h2>
                  <button
                    onClick={() => setShowGenerate(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                    style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35' }}
                  >
                    <RefreshCw size={12} />
                    Ny meny
                  </button>
                </div>

                {/* Meals */}
                {dayMeals.length === 0 ? (
                  <div className="text-center py-8">
                    <Utensils size={32} style={{ color: '#C7C7CC' }} className="mx-auto mb-3" />
                    <p className="text-warm-400 text-[14px]">Inga måltider planerade</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayMeals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        swapping={swapping === `${meal.dayIndex}-${meal.mealType}`}
                        onSwap={() => handleSwap(meal.dayIndex, meal.mealType)}
                        onToggleLock={() => handleToggleLock(meal)}
                      />
                    ))}
                  </div>
                )}

                {/* ── Shopping list (collapsible) ── */}
                {shoppingList.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowShoppingList(!showShoppingList)}
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl"
                      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #E5E5EA' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart size={18} style={{ color: '#FF6B35' }} />
                        <span className="font-body font-semibold text-[14px]" style={{ color: '#1A1A1A' }}>
                          Inköpslista
                        </span>
                        <span className="text-[12px] text-warm-400">
                          ({shoppingList.length} varor)
                        </span>
                      </div>
                      {showShoppingList ? (
                        <ChevronUp size={18} style={{ color: '#A0A0A5' }} />
                      ) : (
                        <ChevronDown size={18} style={{ color: '#A0A0A5' }} />
                      )}
                    </button>

                    <AnimatePresence>
                      {showShoppingList && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white rounded-2xl mt-2 px-4 py-3 space-y-2"
                            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #E5E5EA' }}>
                            {shoppingList.map((item, i) => (
                              <div key={i} className="flex items-center justify-between py-1.5 border-b border-warm-100 last:border-0">
                                <span className="text-[14px] font-body" style={{ color: '#1A1A1A' }}>
                                  {item.name || item}
                                </span>
                                {item.amount && (
                                  <span className="text-[12px] text-warm-400">{item.amount}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Weekly tip ── */}
                {weeklyTip && (
                  <div className="mt-4 p-4 bg-white rounded-2xl flex gap-3"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #E5E5EA' }}>
                    <Lightbulb size={18} style={{ color: '#FF6B35' }} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-warm-400 mb-0.5">Veckans tips</p>
                      <p className="text-[13px] font-body" style={{ color: '#48484A' }}>{weeklyTip}</p>
                    </div>
                  </div>
                )}

                {/* ── Total cost ── */}
                {totalCost && (
                  <div className="mt-3 text-center">
                    <span className="text-[13px] text-warm-400 font-body">
                      Uppskattad veckokostnad: <strong style={{ color: '#1A1A1A' }}>{totalCost}</strong>
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading overlay */}
          {loading && !generating && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-warm-200 border-t-[#FF6B35] animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-red-200">
              <p className="text-[13px] text-red-500 font-body">{error}</p>
            </div>
          )}
        </div>

        {/* ═══ GENERATE BOTTOM SHEET ═══ */}
        <AnimatePresence>
          {showGenerate && (
            <GenerateSheet
              weekStart={weekStart}
              householdSize={householdSize}
              setHouseholdSize={setHouseholdSize}
              dietary={dietary}
              setDietary={setDietary}
              mealsPerDay={mealsPerDay}
              setMealsPerDay={setMealsPerDay}
              generating={generating}
              onGenerate={handleGenerate}
              onClose={() => setShowGenerate(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ GENERATING OVERLAY ═══ */}
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
              style={{ background: 'rgba(235,237,240,0.95)' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
                    'drop-shadow(0 0 24px rgba(255,107,53,0.4))',
                    'drop-shadow(0 0 8px rgba(255,107,53,0.15))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={48} style={{ color: '#FF6B35' }} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-[18px] font-bold mt-6"
                style={{ color: '#1A1A1A' }}
              >
                Nisse planerar din vecka...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[13px] text-warm-400 mt-2 font-body"
              >
                Anpassar recept efter dina preferenser
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ── Meal Card ──

function MealCard({ meal, swapping, onSwap, onToggleLock }) {
  const recipe = meal.recipe || {};
  const title = meal.title || recipe.title || 'Okänd rätt';
  const mealTypeLabel = meal.mealType === 'LUNCH' ? 'Lunch' : 'Middag';
  const cookingTime = recipe.cooking_time || recipe.cookingTime;

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        border: meal.locked ? '1.5px solid #FF6B35' : '1px solid #E5E5EA',
      }}
    >
      <div className="p-4">
        {/* Type label + lock */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: meal.mealType === 'LUNCH' ? '#2ABFBF' : '#FF6B35' }}
          >
            {mealTypeLabel}
          </span>
          <button
            onClick={onToggleLock}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: meal.locked ? 'rgba(255,107,53,0.1)' : '#F5F5F5',
            }}
          >
            {meal.locked ? (
              <Lock size={13} style={{ color: '#FF6B35' }} />
            ) : (
              <Unlock size={13} style={{ color: '#A0A0A5' }} />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-display text-[16px] font-bold leading-snug mb-2" style={{ color: '#1A1A1A' }}>
          {title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          {cookingTime && (
            <div className="flex items-center gap-1">
              <Clock size={12} style={{ color: '#A0A0A5' }} />
              <span className="text-[12px] text-warm-400">{cookingTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users size={12} style={{ color: '#A0A0A5' }} />
              <span className="text-[12px] text-warm-400">{recipe.servings} port.</span>
            </div>
          )}
        </div>

        {/* Swap button */}
        <button
          onClick={onSwap}
          disabled={swapping || meal.locked}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-medium
                   transition-all duration-200 disabled:opacity-40"
          style={{
            background: '#F5F5F5',
            color: '#48484A',
          }}
        >
          {swapping ? (
            <div className="w-4 h-4 rounded-full border-2 border-warm-200 border-t-[#FF6B35] animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          {swapping ? 'Byter...' : 'Byt rätt'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Generate Bottom Sheet ──

function GenerateSheet({
  weekStart, householdSize, setHouseholdSize,
  dietary, setDietary, mealsPerDay, setMealsPerDay,
  generating, onGenerate, onClose,
}) {
  const toggleDietary = useCallback((id) => {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }, [setDietary]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80]"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-3xl"
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          maxHeight: '85dvh',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.12)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-warm-200" />
        </div>

        <div className="px-5 pb-4 overflow-y-auto soft-scroll" style={{ maxHeight: 'calc(85dvh - 40px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[22px] font-bold" style={{ color: '#1A1A1A' }}>
              Generera veckomeny
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#F5F5F5' }}>
              <X size={16} style={{ color: '#48484A' }} />
            </button>
          </div>

          {/* Week display */}
          <div className="flex items-center gap-2 mb-5 p-3 rounded-xl" style={{ background: '#F8F8FA' }}>
            <Calendar size={16} style={{ color: '#FF6B35' }} />
            <span className="text-[14px] font-body" style={{ color: '#48484A' }}>
              Vecka {getWeekNumber(weekStart)}: {formatWeekRange(weekStart)}
            </span>
          </div>

          {/* Household size */}
          <div className="mb-5">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-warm-400 mb-2 block">
              Antal personer
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setHouseholdSize(n)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-semibold
                           transition-all duration-200"
                  style={{
                    background: householdSize === n ? '#FF6B35' : '#F5F5F5',
                    color: householdSize === n ? '#FFFFFF' : '#48484A',
                    boxShadow: householdSize === n ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Meals per day */}
          <div className="mb-5">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-warm-400 mb-2 block">
              Måltider per dag
            </label>
            <div className="flex gap-2">
              {[
                { id: 'lunch', label: 'Lunch' },
                { id: 'dinner', label: 'Middag' },
                { id: 'both', label: 'Båda' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMealsPerDay(opt.id)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: mealsPerDay === opt.id ? '#FF6B35' : '#F5F5F5',
                    color: mealsPerDay === opt.id ? '#FFFFFF' : '#48484A',
                    boxShadow: mealsPerDay === opt.id ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary preferences */}
          <div className="mb-6">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-warm-400 mb-2 block">
              Kostpreferenser
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((opt) => {
                const active = dietary.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleDietary(opt.id)}
                    className="px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-200"
                    style={{
                      background: active ? '#FF6B35' : '#F5F5F5',
                      color: active ? '#FFFFFF' : '#48484A',
                      boxShadow: active ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={onGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
                     font-body font-semibold text-[15px] text-white transition-all
                     disabled:opacity-60"
            style={{
              background: '#FF6B35',
              boxShadow: '0 8px 32px rgba(255,107,53,0.35)',
            }}
          >
            {generating ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Sparkles size={18} strokeWidth={2} />
            )}
            {generating ? 'Genererar...' : 'Skapa veckomeny'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
