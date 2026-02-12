// ============================================
// Validation Middleware — Zod schemas
// ============================================

import { z } from 'zod';

/**
 * Validates request body against a Zod schema
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten();
      return res.status(400).json({
        error: 'validation_error',
        message: 'Ogiltiga uppgifter skickade.',
        details: errors.fieldErrors,
      });
    }

    req.validated = result.data;
    next();
  };
}

// ──────────────────────────────────────────
// Auth schemas
// ──────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z
    .string()
    .min(8, 'Lösenordet måste vara minst 8 tecken')
    .max(128, 'Lösenordet får vara max 128 tecken'),
  name: z.string().min(1).max(100).optional(),
  householdSize: z.number().int().min(1).max(20).optional().default(1),
});

export const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(1, 'Lösenord krävs'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token krävs'),
});

// ──────────────────────────────────────────
// Recipe search schemas
// ──────────────────────────────────────────

export const recipeSearchSchema = z.object({
  query: z
    .string()
    .min(2, 'Sökningen måste vara minst 2 tecken')
    .max(500, 'Sökningen får vara max 500 tecken'),
  householdSize: z.number().int().min(1).max(20).optional(),
  preferences: z
    .object({
      maxTimeMinutes: z.number().int().min(5).max(180).optional(),
      difficulty: z.enum(['Enkel', 'Medel', 'Avancerad']).optional(),
      dietary: z
        .array(z.enum(['vegetarisk', 'vegan', 'glutenfri', 'laktosfri', 'lchf']))
        .optional(),
      maxBudget: z.number().int().min(10).max(2000).optional(),
      occasion: z
        .enum(['vardag', 'fest', 'romantisk', 'barnkalas', 'brunch', 'meal-prep'])
        .optional(),
    })
    .optional(),
});

// ──────────────────────────────────────────
// Cooking assistant schemas
// ──────────────────────────────────────────

export const cookingAskSchema = z.object({
  recipe: z.object({
    title: z.string().min(1),
    ingredients: z.array(z.object({
      name: z.string(),
      amount: z.string(),
    })).optional().default([]),
    steps: z.array(z.union([
      z.string(),
      z.object({ text: z.string() }),
      z.object({ content: z.string() }),
    ])).optional().default([]),
    tips: z.string().optional(),
  }),
  question: z.string().min(1, 'Ställ en fråga').max(500),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});

// ──────────────────────────────────────────
// Recipe generation schemas
// ──────────────────────────────────────────

export const generateRecipeSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, 'Ange minst en ingrediens')
    .max(20, 'Max 20 ingredienser'),
  servings: z.number().int().min(1).max(20).optional().default(4),
  difficulty: z.enum(['Enkel', 'Medel', 'Avancerad']).optional().default('Medel'),
  maxTimeMinutes: z.number().int().min(5).max(180).optional(),
  dietary: z
    .array(z.enum(['vegetarisk', 'vegan', 'glutenfri', 'laktosfri', 'lchf']))
    .optional()
    .default([]),
  style: z
    .enum(['frukost', 'lunch', 'middag', 'dessert', 'mellanmål'])
    .optional()
    .default('middag'),
});

// ──────────────────────────────────────────
// Password reset schemas
// ──────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token krävs'),
  password: z
    .string()
    .min(8, 'Lösenordet måste vara minst 8 tecken')
    .max(128, 'Lösenordet får vara max 128 tecken'),
});

// ──────────────────────────────────────────
// Recipe sharing schema
// ──────────────────────────────────────────

export const shareRecipeSchema = z.object({
  recipeId: z.string().min(1, 'Recept-ID krävs'),
  toEmail: z.string().email('Ogiltig mottagaradress'),
});

export const suggestRecipesSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, 'Ange minst en ingrediens')
    .max(20),
  count: z.number().int().min(1).max(5).optional().default(3),
  style: z
    .enum(['frukost', 'lunch', 'middag', 'dessert', 'mellanmål'])
    .optional(),
});
