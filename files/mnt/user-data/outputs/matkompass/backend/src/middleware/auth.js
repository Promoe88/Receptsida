// ============================================
// Auth Middleware — JWT verification
// ============================================

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/db.js';

/**
 * Requires valid JWT. Attaches user to req.user
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Ingen giltig autentisering. Logga in först.',
    });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      plan: payload.plan,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        message: 'Din session har gått ut. Förnya din token.',
      });
    }
    return res.status(401).json({
      error: 'invalid_token',
      message: 'Ogiltig token.',
    });
  }
}

/**
 * Optional auth — attaches user if token present, continues regardless
 */
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      plan: payload.plan,
    };
  } catch {
    req.user = null;
  }

  next();
}

/**
 * Requires specific plan level
 */
export function requirePlan(...plans) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({
        error: 'insufficient_plan',
        message: `Denna funktion kräver ${plans.join(' eller ')}-plan.`,
      });
    }
    next();
  };
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      plan: user.plan,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

/**
 * Generate refresh token and store in DB
 */
export async function generateRefreshToken(user) {
  const token = jwt.sign(
    { sub: user.id, type: 'refresh' },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );

  // Parse expiry
  const decoded = jwt.decode(token);

  await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  // Cleanup old tokens for this user (keep last 5)
  const tokens = await prisma.refreshToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    skip: 5,
  });

  if (tokens.length > 0) {
    await prisma.refreshToken.deleteMany({
      where: { id: { in: tokens.map((t) => t.id) } },
    });
  }

  return token;
}
