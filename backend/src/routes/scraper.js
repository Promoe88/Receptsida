// ============================================
// Scraper Routes — Manage recipe scraping
// ============================================

import { Router } from 'express';
import { requireAuth, requirePlan } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  startScrapeJob,
  startScrapeAll,
  getJobStatus,
  getJobs,
  getScraperStats,
} from '../scraper/index.js';
import { buildLexicon, getLexiconStats, searchLexicon } from '../services/lexicon-builder.js';
import { generateRecipe, generateRecipeSuggestions } from '../services/recipe-generator.js';
import { prisma } from '../config/db.js';

const router = Router();

// ──────────────────────────────────────────
// POST /scraper/start/:siteId — Start scraping a site
// ──────────────────────────────────────────
router.post(
  '/start/:siteId',
  requireAuth,
  requirePlan('ADMIN'),
  asyncHandler(async (req, res) => {
    const result = await startScrapeJob(req.params.siteId);
    res.json(result);
  })
);

// ──────────────────────────────────────────
// POST /scraper/start-all — Start scraping all sites
// ──────────────────────────────────────────
router.post(
  '/start-all',
  requireAuth,
  requirePlan('ADMIN'),
  asyncHandler(async (req, res) => {
    const results = await startScrapeAll();
    res.json({
      message: 'Scraping startad för alla sajter.',
      jobs: results,
    });
  })
);

// ──────────────────────────────────────────
// GET /scraper/jobs — List scrape jobs
// ──────────────────────────────────────────
router.get(
  '/jobs',
  requireAuth,
  requirePlan('ADMIN'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const result = await getJobs(page, limit);
    res.json(result);
  })
);

// ──────────────────────────────────────────
// GET /scraper/jobs/:id — Get job status
// ──────────────────────────────────────────
router.get(
  '/jobs/:id',
  requireAuth,
  requirePlan('ADMIN'),
  asyncHandler(async (req, res) => {
    const job = await getJobStatus(req.params.id);
    if (!job) {
      throw new AppError(404, 'not_found', 'Jobb hittades inte.');
    }
    res.json(job);
  })
);

// ──────────────────────────────────────────
// GET /scraper/stats — Scraper statistics
// ──────────────────────────────────────────
router.get(
  '/stats',
  requireAuth,
  asyncHandler(async (req, res) => {
    const stats = await getScraperStats();
    res.json(stats);
  })
);

// ──────────────────────────────────────────
// POST /scraper/build-lexicon — Rebuild the word lexicon
// ──────────────────────────────────────────
router.post(
  '/build-lexicon',
  requireAuth,
  requirePlan('ADMIN'),
  asyncHandler(async (req, res) => {
    const stats = await buildLexicon();
    res.json({
      message: 'Lexikon byggt framgångsrikt.',
      stats,
    });
  })
);

// ──────────────────────────────────────────
// GET /scraper/lexicon/stats — Lexicon statistics
// ──────────────────────────────────────────
router.get(
  '/lexicon/stats',
  requireAuth,
  asyncHandler(async (req, res) => {
    const stats = await getLexiconStats();
    res.json(stats);
  })
);

// ──────────────────────────────────────────
// GET /scraper/lexicon/search — Search the recipe lexicon
// ──────────────────────────────────────────
router.get(
  '/lexicon/search',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = (req.query.q || '').trim();
    const category = req.query.category || null;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    if (q.length < 1) {
      return res.json({ words: [] });
    }

    const words = await searchLexicon(q, category, limit);
    res.json({ words });
  })
);

// ──────────────────────────────────────────
// GET /scraper/recipes — Browse scraped recipes
// ──────────────────────────────────────────
router.get(
  '/recipes',
  requireAuth,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;
    const domain = req.query.domain || undefined;
    const category = req.query.category || undefined;
    const search = req.query.q || undefined;

    const where = {};
    if (domain) where.sourceDomain = domain;
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [recipes, total] = await Promise.all([
      prisma.scrapedRecipe.findMany({
        where,
        include: {
          ingredients: {
            select: { name: true, amount: true, unit: true },
            orderBy: { sortOrder: 'asc' },
          },
          _count: { select: { steps: true } },
        },
        orderBy: { scrapedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.scrapedRecipe.count({ where }),
    ]);

    res.json({
      recipes: recipes.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        sourceUrl: r.sourceUrl,
        sourceDomain: r.sourceDomain,
        imageUrl: r.imageUrl,
        totalTime: r.totalTime,
        servings: r.servings,
        category: r.category,
        cuisine: r.cuisine,
        rating: r.rating,
        ingredientCount: r.ingredients.length,
        stepCount: r._count.steps,
        ingredients: r.ingredients.map((i) => i.name),
        scrapedAt: r.scrapedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// ──────────────────────────────────────────
// GET /scraper/recipes/:id — Get full scraped recipe
// ──────────────────────────────────────────
router.get(
  '/recipes/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const recipe = await prisma.scrapedRecipe.findUnique({
      where: { id: req.params.id },
      include: {
        ingredients: { orderBy: { sortOrder: 'asc' } },
        steps: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!recipe) {
      throw new AppError(404, 'not_found', 'Receptet hittades inte.');
    }

    res.json(recipe);
  })
);

// ──────────────────────────────────────────
// POST /scraper/generate — Generate an AI recipe
// ──────────────────────────────────────────
router.post(
  '/generate',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      ingredients = [],
      servings = 4,
      difficulty = 'Medel',
      maxTimeMinutes,
      dietary = [],
      style = 'middag',
    } = req.body;

    if (ingredients.length === 0) {
      throw new AppError(400, 'validation_error', 'Ange minst en ingrediens.');
    }

    const recipe = await generateRecipe({
      ingredients,
      servings,
      difficulty,
      maxTimeMinutes,
      dietary,
      style,
    });

    res.json(recipe);
  })
);

// ──────────────────────────────────────────
// POST /scraper/suggest — Get recipe suggestions
// ──────────────────────────────────────────
router.post(
  '/suggest',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { ingredients = [], count = 3, style } = req.body;

    if (ingredients.length === 0) {
      throw new AppError(400, 'validation_error', 'Ange minst en ingrediens.');
    }

    const suggestions = await generateRecipeSuggestions({
      ingredients,
      count: Math.min(count, 5),
      style,
    });

    res.json(suggestions);
  })
);

export default router;
