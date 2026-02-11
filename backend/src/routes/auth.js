// ============================================
// Auth Routes — Register, Login, Refresh
// ============================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';
import { validate, registerSchema, loginSchema, refreshSchema } from '../middleware/validate.js';
import { generateAccessToken, generateRefreshToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// ──────────────────────────────────────────
// POST /auth/register
// ──────────────────────────────────────────
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, name, householdSize } = req.validated;

    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'email_taken', 'E-postadressen är redan registrerad.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + quota
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        householdSize,
        searchQuota: {
          create: { searchesUsed: 0 },
        },
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        householdSize: user.householdSize,
        plan: user.plan,
      },
      accessToken,
      refreshToken,
    });
  })
);

// ──────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'invalid_credentials', 'Fel e-post eller lösenord.');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError(401, 'invalid_credentials', 'Fel e-post eller lösenord.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        householdSize: user.householdSize,
        plan: user.plan,
      },
      accessToken,
      refreshToken,
    });
  })
);

// ──────────────────────────────────────────
// POST /auth/refresh
// ──────────────────────────────────────────
router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.validated;

    // Verify the refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch {
      throw new AppError(401, 'invalid_refresh_token', 'Ogiltig refresh-token.');
    }

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Delete used/expired token
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new AppError(401, 'expired_refresh_token', 'Refresh-token har gått ut.');
    }

    // Rotate: delete old token, create new pair
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newAccessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = await generateRefreshToken(storedToken.user);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  })
);

// ──────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────
router.post(
  '/logout',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Delete all refresh tokens for user
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: 'Utloggad.' });
  })
);

// ──────────────────────────────────────────
// GET /auth/me
// ──────────────────────────────────────────
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        searchQuota: true,
        _count: { select: { favorites: true, searches: true } },
      },
    });

    if (!user) {
      throw new AppError(404, 'user_not_found', 'Användaren hittades inte.');
    }

    const limit =
      user.plan === 'FREE'
        ? config.RECIPE_SEARCH_LIMIT_PER_HOUR
        : config.RECIPE_SEARCH_LIMIT_PER_HOUR_PREMIUM;

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      householdSize: user.householdSize,
      plan: user.plan,
      stats: {
        totalSearches: user._count.searches,
        totalFavorites: user._count.favorites,
        searchesUsedThisPeriod: user.searchQuota?.searchesUsed || 0,
        searchLimit: limit,
      },
      createdAt: user.createdAt,
    });
  })
);

export default router;
