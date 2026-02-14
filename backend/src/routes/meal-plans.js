// ============================================
// Meal Plan Routes — Weekly meal planning
// ============================================

import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate, generateMealPlanSchema, swapMealSchema, lockMealSchema } from '../middleware/validate.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { generateMealPlan } from '../services/claude.js';

const router = Router();

// ──────────────────────────────────────────
// POST /meal-plans/generate — AI-powered weekly plan
// ──────────────────────────────────────────
router.post(
  '/generate',
  requireAuth,
  validate(generateMealPlanSchema),
  asyncHandler(async (req, res) => {
    const { weekStart, householdSize, preferences } = req.validated;
    const effectiveHouseholdSize = householdSize || req.user.householdSize || 2;

    // Check if user already has a plan for this week
    const weekDate = new Date(weekStart);
    const existing = await prisma.mealPlan.findFirst({
      where: { userId: req.user.id, weekStart: weekDate },
      include: { meals: true },
    });

    // Collect locked meals from existing plan
    const lockedMeals = existing
      ? existing.meals.filter((m) => m.locked).map((m) => ({
          dayIndex: m.dayIndex,
          mealType: m.mealType,
          title: m.title,
        }))
      : [];

    // Generate via Claude AI
    let aiPlan;
    try {
      aiPlan = await generateMealPlan(effectiveHouseholdSize, preferences || {}, lockedMeals);
    } catch (err) {
      console.error('Meal plan generation failed:', err.message);
      throw new AppError(500, 'generation_failed', 'Kunde inte generera veckomenyn. Försök igen.');
    }

    if (!aiPlan.meals || aiPlan.meals.length === 0) {
      throw new AppError(500, 'empty_plan', 'AI genererade en tom veckomeny. Försök igen.');
    }

    // Delete old plan for this week if it exists (replace)
    if (existing) {
      await prisma.mealPlan.delete({ where: { id: existing.id } });
    }

    // Calculate week number for name
    const weekNum = getWeekNumber(weekDate);

    // Save to database
    const plan = await prisma.mealPlan.create({
      data: {
        userId: req.user.id,
        name: `Vecka ${weekNum}`,
        weekStart: weekDate,
        householdSize: effectiveHouseholdSize,
        preferences: preferences || {},
        meals: {
          create: aiPlan.meals.map((meal) => ({
            dayIndex: meal.dayIndex,
            mealType: meal.mealType || 'DINNER',
            title: meal.title,
            recipeData: meal,
            locked: lockedMeals.some(
              (lm) => lm.dayIndex === meal.dayIndex && lm.mealType === meal.mealType
            ),
          })),
        },
      },
      include: { meals: { orderBy: { dayIndex: 'asc' } } },
    });

    res.json({
      plan: formatPlan(plan),
      shopping_list: aiPlan.shopping_list || [],
      total_estimated_cost: aiPlan.total_estimated_cost,
      weekly_tip: aiPlan.weekly_tip,
    });
  })
);

// ──────────────────────────────────────────
// GET /meal-plans — List user's meal plans
// ──────────────────────────────────────────
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const plans = await prisma.mealPlan.findMany({
      where: { userId: req.user.id },
      include: { meals: { orderBy: { dayIndex: 'asc' } } },
      orderBy: { weekStart: 'desc' },
      take: 10,
    });

    res.json({ plans: plans.map(formatPlan) });
  })
);

// ──────────────────────────────────────────
// GET /meal-plans/:id — Get specific plan
// ──────────────────────────────────────────
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const plan = await prisma.mealPlan.findUnique({
      where: { id: req.params.id },
      include: { meals: { orderBy: { dayIndex: 'asc' } } },
    });

    if (!plan || plan.userId !== req.user.id) {
      throw new AppError(404, 'not_found', 'Veckomenyn hittades inte.');
    }

    res.json({ plan: formatPlan(plan) });
  })
);

// ──────────────────────────────────────────
// POST /meal-plans/:id/swap — Swap a single meal
// ──────────────────────────────────────────
router.post(
  '/:id/swap',
  requireAuth,
  validate(swapMealSchema),
  asyncHandler(async (req, res) => {
    const { dayIndex, mealType } = req.validated;

    const plan = await prisma.mealPlan.findUnique({
      where: { id: req.params.id },
      include: { meals: true },
    });

    if (!plan || plan.userId !== req.user.id) {
      throw new AppError(404, 'not_found', 'Veckomenyn hittades inte.');
    }

    const meal = plan.meals.find((m) => m.dayIndex === dayIndex && m.mealType === mealType);
    if (!meal) {
      throw new AppError(404, 'meal_not_found', 'Måltiden hittades inte.');
    }

    if (meal.locked) {
      throw new AppError(400, 'meal_locked', 'Måltiden är låst. Lås upp den först.');
    }

    // Get locked meals to preserve them
    const lockedMeals = plan.meals
      .filter((m) => m.locked)
      .map((m) => ({ dayIndex: m.dayIndex, mealType: m.mealType, title: m.title }));

    // Regenerate just this meal
    const aiPlan = await generateMealPlan(plan.householdSize, plan.preferences || {}, [
      ...lockedMeals,
      // Lock all OTHER meals (only swap the target)
      ...plan.meals
        .filter((m) => !(m.dayIndex === dayIndex && m.mealType === mealType) && !m.locked)
        .map((m) => ({ dayIndex: m.dayIndex, mealType: m.mealType, title: m.title })),
    ]);

    const newMeal = aiPlan.meals?.find((m) => m.dayIndex === dayIndex);
    if (!newMeal) {
      throw new AppError(500, 'swap_failed', 'Kunde inte hitta en ny rätt. Försök igen.');
    }

    // Update in database
    await prisma.mealPlanDay.update({
      where: { id: meal.id },
      data: { title: newMeal.title, recipeData: newMeal },
    });

    // Return updated plan
    const updated = await prisma.mealPlan.findUnique({
      where: { id: plan.id },
      include: { meals: { orderBy: { dayIndex: 'asc' } } },
    });

    res.json({ plan: formatPlan(updated) });
  })
);

// ──────────────────────────────────────────
// PATCH /meal-plans/:id/meals/:mealId/lock — Lock/unlock a meal
// ──────────────────────────────────────────
router.patch(
  '/:id/meals/:mealId/lock',
  requireAuth,
  validate(lockMealSchema),
  asyncHandler(async (req, res) => {
    const { locked } = req.validated;

    const plan = await prisma.mealPlan.findUnique({ where: { id: req.params.id } });
    if (!plan || plan.userId !== req.user.id) {
      throw new AppError(404, 'not_found', 'Veckomenyn hittades inte.');
    }

    await prisma.mealPlanDay.update({
      where: { id: req.params.mealId },
      data: { locked },
    });

    res.json({ locked });
  })
);

// ──────────────────────────────────────────
// DELETE /meal-plans/:id — Delete a plan
// ──────────────────────────────────────────
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const plan = await prisma.mealPlan.findUnique({ where: { id: req.params.id } });
    if (!plan || plan.userId !== req.user.id) {
      throw new AppError(404, 'not_found', 'Veckomenyn hittades inte.');
    }

    await prisma.mealPlan.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  })
);

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function formatPlan(plan) {
  return {
    id: plan.id,
    name: plan.name,
    weekStart: plan.weekStart,
    householdSize: plan.householdSize,
    preferences: plan.preferences,
    meals: plan.meals.map((m) => ({
      id: m.id,
      dayIndex: m.dayIndex,
      mealType: m.mealType,
      title: m.title,
      locked: m.locked,
      recipe: m.recipeData,
    })),
    createdAt: plan.createdAt,
  };
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export default router;
