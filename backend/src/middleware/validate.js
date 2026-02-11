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
    })
    .optional(),
});
