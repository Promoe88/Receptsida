// ============================================
// Lexicon Routes — Autocomplete
// ============================================

import { Router } from 'express';
import { suggestIngredients } from '../services/lexicon.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// ──────────────────────────────────────────
// GET /lexicon/suggest?q=kyck
// ──────────────────────────────────────────
router.get(
  '/suggest',
  asyncHandler(async (req, res) => {
    const q = (req.query.q || '').toString().trim();
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    if (q.length < 1) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await suggestIngredients(q, limit);

    res.json({ suggestions });
  })
);

export default router;
