// ============================================
// GDPR Routes — Data export, deletion, consent
// ============================================

import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// ──────────────────────────────────────────
// POST /gdpr/consent — Record user consent
// ──────────────────────────────────────────
router.post(
  '/consent',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { type, granted } = req.body;

    const validTypes = ['PRIVACY_POLICY', 'COOKIES', 'LOCATION', 'MARKETING'];
    if (!validTypes.includes(type)) {
      throw new AppError(400, 'invalid_type', 'Ogiltig samtyckes-typ.');
    }

    if (typeof granted !== 'boolean') {
      throw new AppError(400, 'invalid_granted', 'Samtycke måste vara true/false.');
    }

    await prisma.consentRecord.create({
      data: {
        userId: req.user.id,
        type,
        granted,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 500),
      },
    });

    // Update user-level flags
    const updates = {};
    if (type === 'PRIVACY_POLICY' && granted) {
      updates.gdprConsentAt = new Date();
    }
    if (type === 'LOCATION') {
      updates.locationConsent = granted;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: updates,
      });
    }

    res.json({ message: 'Samtycke registrerat.' });
  })
);

// ──────────────────────────────────────────
// GET /gdpr/consent — Get current consent status
// ──────────────────────────────────────────
router.get(
  '/consent',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Get the latest consent record for each type
    const records = await prisma.consentRecord.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const consentStatus = {};
    const seen = new Set();
    for (const record of records) {
      if (!seen.has(record.type)) {
        seen.add(record.type);
        consentStatus[record.type] = {
          granted: record.granted,
          recordedAt: record.createdAt,
        };
      }
    }

    res.json({ consent: consentStatus });
  })
);

// ──────────────────────────────────────────
// GET /gdpr/export — Export all user data (GDPR Art. 20)
// ──────────────────────────────────────────
router.get(
  '/export',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        searches: {
          include: { recipes: { include: { ingredients: true, steps: true } } },
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
        favorites: {
          include: { recipe: true },
        },
        consentRecords: {
          orderBy: { createdAt: 'desc' },
        },
        searchQuota: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'user_not_found', 'Användaren hittades inte.');
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      gdprNote: 'Denna export innehåller alla personuppgifter vi lagrar om dig i enlighet med GDPR Art. 20.',
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        householdSize: user.householdSize,
        plan: user.plan,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        onboardingDone: user.onboardingDone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      searches: user.searches.map((s) => ({
        query: s.query,
        ingredients: s.ingredients,
        householdSize: s.householdSize,
        resultCount: s.resultCount,
        createdAt: s.createdAt,
        recipes: s.recipes.map((r) => ({
          title: r.title,
          sourceName: r.sourceName,
          sourceUrl: r.sourceUrl,
          timeMinutes: r.timeMinutes,
          difficulty: r.difficulty,
          servings: r.servings,
        })),
      })),
      favorites: user.favorites.map((f) => ({
        recipeTitle: f.recipe.title,
        savedAt: f.createdAt,
      })),
      consentHistory: user.consentRecords.map((c) => ({
        type: c.type,
        granted: c.granted,
        recordedAt: c.createdAt,
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="nisse-data-export-${user.id}.json"`);
    res.json(exportData);
  })
);

// ──────────────────────────────────────────
// POST /gdpr/delete-account — Request account deletion (GDPR Art. 17)
// ──────────────────────────────────────────
router.post(
  '/delete-account',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { confirmEmail } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new AppError(404, 'user_not_found', 'Användaren hittades inte.');
    }

    if (confirmEmail !== user.email) {
      throw new AppError(400, 'email_mismatch', 'E-postadressen matchar inte. Bekräfta genom att ange din e-post.');
    }

    // Cascade delete handles all related records (refresh tokens, searches, favorites, etc.)
    await prisma.user.delete({ where: { id: req.user.id } });

    res.json({
      message: 'Ditt konto och alla tillhörande uppgifter har raderats permanent.',
    });
  })
);

export default router;
