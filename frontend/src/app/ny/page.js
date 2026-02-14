// ============================================
// Veckoplanering — AI Weekly Meal Planner
// Mobile-first, warm Scandinavian, #FF6B35 accent
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronRight, RefreshCw, Lock, Unlock,
  ShoppingCart, Sparkles, ChevronDown, ChevronUp, Lightbulb, X,
  Utensils, Clock, Users, Check, Minus, Plus, ListOrdered, Wrench,
  AlertTriangle, GraduationCap, ArrowRight, Wine,
} from 'lucide-react';
import { isApp } from '../../lib/platform';
import { useAuthStore } from '../../lib/store';
import { useMealPlan } from '../../hooks/useRecipes';
import { AppPageHeader } from '../../components/app/AppPageHeader';
import { getStepText } from '../../data/recipes';
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
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [householdSize, setHouseholdSize] = useState(user?.householdSize || 2);
  const [dietary, setDietary] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState('dinner');
  const [maxBudget, setMaxBudget] = useState(0); // 0 = no limit
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
        maxBudget: maxBudget > 0 ? maxBudget : undefined,
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
                        onSelect={() => setSelectedMeal(meal)}
                      />
                    ))}
                  </div>
                )}

                {/* ── Shopping list (collapsible, grouped) ── */}
                {shoppingList.length > 0 && (
                  <ShoppingListSection
                    shoppingList={shoppingList}
                    showShoppingList={showShoppingList}
                    onToggle={() => setShowShoppingList(!showShoppingList)}
                  />
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
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              generating={generating}
              onGenerate={handleGenerate}
              onClose={() => setShowGenerate(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ MEAL DETAIL SHEET ═══ */}
        <AnimatePresence>
          {selectedMeal && (
            <MealDetailSheet
              meal={selectedMeal}
              onClose={() => setSelectedMeal(null)}
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

function MealCard({ meal, swapping, onSwap, onToggleLock, onSelect }) {
  const recipe = meal.recipe || {};
  const title = meal.title || recipe.title || 'Okänd rätt';
  const mealTypeLabel = meal.mealType === 'LUNCH' ? 'Lunch' : 'Middag';
  const cookingTime = recipe.cooking_time || recipe.cookingTime;
  const ingredientCount = recipe.ingredients?.length || 0;

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

        {/* Clickable recipe area */}
        <button onClick={onSelect} className="w-full text-left">
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
            {ingredientCount > 0 && (
              <div className="flex items-center gap-1">
                <ShoppingCart size={12} style={{ color: '#A0A0A5' }} />
                <span className="text-[12px] text-warm-400">{ingredientCount} ingredienser</span>
              </div>
            )}
          </div>

          {/* "Visa recept" hint */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[12px] font-medium" style={{ color: '#FF6B35' }}>Visa recept</span>
            <ChevronRight size={12} style={{ color: '#FF6B35' }} />
          </div>
        </button>

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
  maxBudget, setMaxBudget,
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

          {/* Budget */}
          <div className="mb-6">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-warm-400 mb-2 block">
              Veckobudget
            </label>
            <div className="flex gap-2">
              {[
                { value: 0, label: 'Ingen gräns' },
                { value: 500, label: '500 kr' },
                { value: 750, label: '750 kr' },
                { value: 1000, label: '1 000 kr' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMaxBudget(opt.value)}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200"
                  style={{
                    background: maxBudget === opt.value ? '#FF6B35' : '#F5F5F5',
                    color: maxBudget === opt.value ? '#FFFFFF' : '#48484A',
                    boxShadow: maxBudget === opt.value ? '0 4px 12px rgba(255,107,53,0.3)' : 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
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

// ── Ingredient emoji helper ──

const INGREDIENT_EMOJIS = {
  'kycklingfilé': '🍗', 'kyckling': '🍗', 'pasta': '🍝', 'penne': '🍝',
  'grädde': '🥛', 'crème fraiche': '🥛', 'vitlök': '🧄', 'lök': '🧅',
  'tomat': '🍅', 'krossade tomater': '🍅', 'ost': '🧀', 'parmesan': '🧀',
  'smör': '🧈', 'olivolja': '🫒', 'olja': '🫒', 'salt': '🧂', 'peppar': '🧂',
  'basilika': '🌿', 'oregano': '🌿', 'spenat': '🥬', 'paprika': '🫑',
  'lax': '🐟', 'räkor': '🦐', 'ris': '🍚', 'potatis': '🥔',
  'morot': '🥕', 'broccoli': '🥦', 'ägg': '🥚', 'mjölk': '🥛',
  'socker': '🍬', 'mjöl': '🌾', 'nötfärs': '🥩', 'fläskfilé': '🥩',
};

function getIngredientEmoji(name) {
  const lower = (name || '').toLowerCase().trim();
  if (INGREDIENT_EMOJIS[lower]) return INGREDIENT_EMOJIS[lower];
  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return '🥘';
}

/** Scale an amount string like "200 g" by a factor */
function scaleAmount(amount, factor) {
  if (!amount || factor === 1) return amount;
  return amount.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
    const num = parseFloat(match.replace(',', '.'));
    const scaled = Math.round(num * factor * 10) / 10;
    return String(scaled).replace('.', ',');
  });
}

// ── Meal Detail Bottom Sheet ──

function MealDetailSheet({ meal, onClose }) {
  const recipe = meal.recipe || {};
  const title = meal.title || recipe.title || 'Okänd rätt';
  const [servings, setServings] = useState(recipe.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [checkedSteps, setCheckedSteps] = useState(new Set());

  const scaleFactor = useMemo(() => {
    const original = recipe.servings || 4;
    return servings / original;
  }, [servings, recipe?.servings]);

  function toggleIngredient(idx) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function toggleStep(idx) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80]"
        style={{ background: 'rgba(0,0,0,0.4)' }}
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
          maxHeight: '92dvh',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-warm-200" />
        </div>

        <div className="px-5 pb-4 overflow-y-auto soft-scroll" style={{ maxHeight: 'calc(92dvh - 40px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: meal.mealType === 'LUNCH' ? '#2ABFBF' : '#FF6B35' }}
              >
                {meal.mealType === 'LUNCH' ? 'Lunch' : 'Middag'}
              </span>
              <h2 className="font-display text-[22px] font-bold mt-1" style={{ color: '#1A1A1A' }}>
                {title}
              </h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#F5F5F5' }}>
              <X size={16} style={{ color: '#48484A' }} />
            </button>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-[14px] text-warm-500 mb-4 leading-relaxed font-body">{recipe.description}</p>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(recipe.cooking_time || recipe.cookingTime) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                style={{ background: '#F8F8FA', color: '#48484A' }}>
                <Clock size={12} style={{ color: '#FF6B35' }} />
                {recipe.cooking_time || recipe.cookingTime}
              </span>
            )}
            {recipe.servings && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                style={{ background: '#F8F8FA', color: '#48484A' }}>
                <Users size={12} style={{ color: '#FF6B35' }} />
                {recipe.servings} portioner
              </span>
            )}
          </div>

          {/* Servings control */}
          {recipe.ingredients?.length > 0 && (
            <div className="flex items-center justify-center gap-5 mb-5 py-3 rounded-2xl" style={{ background: '#F8F8FA' }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
              >
                <Minus size={16} style={{ color: '#48484A' }} strokeWidth={2.5} />
              </motion.button>
              <span className="text-[14px] font-bold min-w-[90px] text-center" style={{ color: '#1A1A1A' }}>
                {servings} portioner
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
              >
                <Plus size={16} style={{ color: '#48484A' }} strokeWidth={2.5} />
              </motion.button>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-[14px] font-bold mb-3" style={{ color: '#1A1A1A' }}>
                <ShoppingCart size={15} style={{ color: '#FF6B35' }} />
                Ingredienser
              </h3>
              <div className="space-y-1.5">
                {recipe.ingredients.map((ing, idx) => {
                  const checked = checkedIngredients.has(idx);
                  const emoji = getIngredientEmoji(ing.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                      style={{ background: checked ? '#F8F8FA' : '#FFFFFF', border: '1px solid #E5E5EA' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: checked ? '#2ABFBF' : 'transparent',
                          border: checked ? 'none' : '2px solid #E5E5EA',
                        }}
                      >
                        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[14px] flex-shrink-0">{emoji}</span>
                      <span className={`flex-1 text-[13px] font-medium transition-all ${checked ? 'text-warm-400 line-through' : ''}`}
                        style={{ color: checked ? undefined : '#1A1A1A' }}>
                        {ing.name}{' '}
                        {ing.amount && (
                          <span className="text-warm-400 font-normal">
                            {scaleFactor !== 1 ? scaleAmount(ing.amount, scaleFactor) : ing.amount}
                          </span>
                        )}
                      </span>
                      {ing.have && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: '#E8F8F8', color: '#2ABFBF' }}>
                          Hemma
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tools */}
          {(recipe.tools?.length > 0 || recipe.equipment_needed?.length > 0) && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-[14px] font-bold mb-3" style={{ color: '#1A1A1A' }}>
                <Wrench size={15} style={{ color: '#FF6B35' }} />
                Verktyg
              </h3>
              <div className="flex flex-wrap gap-2">
                {(recipe.equipment_needed || recipe.tools || []).map((tool, idx) => {
                  const name = typeof tool === 'string' ? tool : (tool.item || tool.name);
                  return (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium"
                      style={{ background: '#F8F8FA', color: '#48484A' }}>
                      <Wrench size={11} style={{ color: '#A0A0A5' }} />
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steps */}
          {recipe.steps?.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-[14px] font-bold mb-3" style={{ color: '#1A1A1A' }}>
                <ListOrdered size={15} style={{ color: '#FF6B35' }} />
                Gör så här
              </h3>
              <div className="space-y-0 divide-y" style={{ borderColor: '#F0F0F2' }}>
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleStep(idx)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 transition-all"
                        style={{
                          background: checkedSteps.has(idx) ? '#FF6B35' : '#F8F8FA',
                          color: checkedSteps.has(idx) ? '#FFFFFF' : '#48484A',
                        }}
                      >
                        {checkedSteps.has(idx) ? <Check size={11} strokeWidth={3} /> : idx + 1}
                      </button>
                      <div className="flex-1">
                        <p className={`text-[13px] leading-relaxed transition-all font-body
                          ${checkedSteps.has(idx) ? 'text-warm-400 line-through' : ''}`}
                          style={{ color: checkedSteps.has(idx) ? undefined : '#48484A' }}>
                          {getStepText(step)}
                        </p>
                        {step.warning && !checkedSteps.has(idx) && (
                          <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#FF6B35' }}>
                            <AlertTriangle size={10} /> {step.warning}
                          </p>
                        )}
                        {step.beginner_tip && !checkedSteps.has(idx) && (
                          <p className="text-[11px] mt-1" style={{ color: '#2ABFBF' }}>
                            <GraduationCap size={10} className="inline mr-1" />{step.beginner_tip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {recipe.tips && (
            <div className="p-4 rounded-2xl mb-5 flex gap-3" style={{ background: '#FFF8F5' }}>
              <Lightbulb size={16} style={{ color: '#FF6B35' }} className="flex-shrink-0 mt-0.5" />
              <p className="text-[13px] font-body" style={{ color: '#48484A' }}>
                <strong className="font-semibold" style={{ color: '#FF6B35' }}>Tips:</strong> {recipe.tips}
              </p>
            </div>
          )}

          {/* Drink pairing */}
          {recipe.drink_pairing && (
            <div className="p-4 rounded-2xl mb-5 flex gap-3" style={{ background: '#F8F8FA', border: '1px solid #E5E5EA' }}>
              <Wine size={15} style={{ color: '#A0A0A5' }} className="flex-shrink-0 mt-0.5" />
              <p className="text-[13px] font-body" style={{ color: '#48484A' }}>
                <strong className="font-medium" style={{ color: '#1A1A1A' }}>Dryck:</strong> {recipe.drink_pairing}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Shopping List Helpers ──

const AISLE_ORDER = [
  'Frukt & Grönt', 'Kött & Fisk', 'Mejeri', 'Skafferi', 'Kryddor', 'Övrigt',
];

const AISLE_EMOJIS = {
  'Frukt & Grönt': '🥬',
  'Kött & Fisk': '🥩',
  'Mejeri': '🧀',
  'Skafferi': '🥫',
  'Kryddor': '🧂',
  'Övrigt': '🛒',
};

function categorizeItem(name) {
  const lower = (name || '').toLowerCase();
  const produce = ['tomat', 'lök', 'vitlök', 'morot', 'potatis', 'paprika', 'broccoli', 'spenat', 'gurka', 'sallad', 'citron', 'lime', 'ingefära', 'avokado', 'squash', 'zucchini', 'selleri', 'purjolök', 'rödlök'];
  const meat = ['kyckling', 'nöt', 'fläsk', 'lax', 'torsk', 'räk', 'bacon', 'korv', 'köttfärs', 'fisk', 'filé', 'biff', 'kassler', 'skinka'];
  const dairy = ['mjölk', 'grädde', 'ost', 'smör', 'yoghurt', 'crème', 'ägg', 'parmesan', 'mozzarella', 'fetaost', 'kvarg'];
  const spices = ['salt', 'peppar', 'basilika', 'oregano', 'timjan', 'kanel', 'kummin', 'curry', 'paprikapulver', 'chili', 'rosmarin', 'persilja', 'dill'];

  if (produce.some((p) => lower.includes(p))) return 'Frukt & Grönt';
  if (meat.some((p) => lower.includes(p))) return 'Kött & Fisk';
  if (dairy.some((p) => lower.includes(p))) return 'Mejeri';
  if (spices.some((p) => lower.includes(p))) return 'Kryddor';
  return 'Skafferi';
}

function groupShoppingList(items) {
  const groups = {};
  for (const item of items) {
    const name = item.name || (typeof item === 'string' ? item : '');
    const aisle = item.aisle || categorizeItem(name);
    if (!groups[aisle]) groups[aisle] = [];
    groups[aisle].push(item);
  }
  // Sort by defined order
  return AISLE_ORDER
    .filter((a) => groups[a]?.length > 0)
    .map((aisle) => ({ aisle, items: groups[aisle] }))
    .concat(
      Object.entries(groups)
        .filter(([a]) => !AISLE_ORDER.includes(a))
        .map(([aisle, items]) => ({ aisle, items }))
    );
}

// ── Shopping List Section Component ──

function ShoppingListSection({ shoppingList, showShoppingList, onToggle }) {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const grouped = useMemo(() => groupShoppingList(shoppingList), [shoppingList]);
  const totalItems = shoppingList.length;
  const checkedCount = checkedItems.size;

  function toggleItem(key) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="mt-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #E5E5EA' }}
      >
        <div className="flex items-center gap-2.5">
          <ShoppingCart size={18} style={{ color: '#FF6B35' }} />
          <span className="font-body font-semibold text-[14px]" style={{ color: '#1A1A1A' }}>
            Inköpslista
          </span>
          <span className="text-[12px] text-warm-400">
            {checkedCount > 0
              ? `${checkedCount}/${totalItems} avprickat`
              : `${totalItems} varor`}
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
            <div className="mt-2 space-y-2">
              {grouped.map(({ aisle, items }) => (
                <div key={aisle} className="bg-white rounded-2xl px-4 py-3"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #E5E5EA' }}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-2 pb-2" style={{ borderBottom: '1px solid #F0F0F2' }}>
                    <span className="text-[14px]">{AISLE_EMOJIS[aisle] || '🛒'}</span>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-warm-400">
                      {aisle}
                    </span>
                  </div>
                  {/* Items */}
                  <div className="space-y-1">
                    {items.map((item, i) => {
                      const name = item.name || (typeof item === 'string' ? item : '');
                      const key = `${aisle}-${i}`;
                      const checked = checkedItems.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center gap-3 py-2 text-left"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                            style={{
                              background: checked ? '#2ABFBF' : 'transparent',
                              border: checked ? 'none' : '2px solid #E5E5EA',
                            }}
                          >
                            {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`flex-1 text-[13px] font-body transition-all ${checked ? 'text-warm-400 line-through' : ''}`}
                            style={{ color: checked ? undefined : '#1A1A1A' }}>
                            {name}
                          </span>
                          {item.amount && (
                            <span className={`text-[12px] flex-shrink-0 ${checked ? 'text-warm-300' : 'text-warm-400'}`}>
                              {item.amount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
