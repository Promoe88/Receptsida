// ============================================
// Social Auth Routes — Google & Apple Sign-In
// ============================================

import { Router } from 'express';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// ──────────────────────────────────────────
// POST /auth/google — Sign in with Google ID token
// ──────────────────────────────────────────
router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== 'string') {
      throw new AppError(400, 'missing_token', 'Google ID-token saknas.');
    }

    if (!config.GOOGLE_CLIENT_ID) {
      throw new AppError(503, 'not_configured', 'Google-inloggning är inte konfigurerad.');
    }

    // Verify the Google ID token by calling Google's tokeninfo endpoint
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!googleResponse.ok) {
      throw new AppError(401, 'invalid_google_token', 'Ogiltig Google-token.');
    }

    const payload = await googleResponse.json();

    // Verify the audience matches our client ID
    if (payload.aud !== config.GOOGLE_CLIENT_ID) {
      throw new AppError(401, 'invalid_audience', 'Token tillhör inte denna app.');
    }

    const { sub: googleId, email, name, email_verified } = payload;

    if (!email) {
      throw new AppError(400, 'no_email', 'Kunde inte hämta e-postadress från Google.');
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { authProvider: 'GOOGLE', providerId: googleId },
          { email },
        ],
      },
    });

    if (user) {
      // Link Google auth if existing email user hasn't linked yet
      if (user.authProvider === 'EMAIL' && !user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: 'GOOGLE',
            providerId: googleId,
            emailVerified: true,
            name: user.name || name,
          },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          authProvider: 'GOOGLE',
          providerId: googleId,
          emailVerified: !!email_verified,
          searchQuota: { create: { searchesUsed: 0 } },
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshTokenValue = await generateRefreshToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        householdSize: user.householdSize,
        plan: user.plan,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
        onboardingDone: user.onboardingDone,
      },
      accessToken,
      refreshToken: refreshTokenValue,
      isNewUser: !user.onboardingDone,
    });
  })
);

// ──────────────────────────────────────────
// POST /auth/apple — Sign in with Apple
// ──────────────────────────────────────────
router.post(
  '/apple',
  asyncHandler(async (req, res) => {
    const { identityToken, authorizationCode, fullName } = req.body;

    if (!identityToken || typeof identityToken !== 'string') {
      throw new AppError(400, 'missing_token', 'Apple identity token saknas.');
    }

    if (!config.APPLE_CLIENT_ID) {
      throw new AppError(503, 'not_configured', 'Apple-inloggning är inte konfigurerad.');
    }

    // Decode the Apple JWT identity token (header.payload.signature)
    const parts = identityToken.split('.');
    if (parts.length !== 3) {
      throw new AppError(401, 'invalid_apple_token', 'Ogiltig Apple-token.');
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    } catch {
      throw new AppError(401, 'invalid_apple_token', 'Kunde inte avkoda Apple-token.');
    }

    // Verify issuer and audience
    if (tokenPayload.iss !== 'https://appleid.apple.com') {
      throw new AppError(401, 'invalid_issuer', 'Ogiltig token-utfärdare.');
    }

    if (tokenPayload.aud !== config.APPLE_CLIENT_ID) {
      throw new AppError(401, 'invalid_audience', 'Token tillhör inte denna app.');
    }

    // Check expiration
    if (tokenPayload.exp && tokenPayload.exp * 1000 < Date.now()) {
      throw new AppError(401, 'token_expired', 'Apple-token har gått ut.');
    }

    const appleId = tokenPayload.sub;
    const email = tokenPayload.email;

    if (!email) {
      throw new AppError(400, 'no_email', 'Kunde inte hämta e-postadress från Apple.');
    }

    // Build name from Apple's fullName object
    const displayName = fullName
      ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ') || null
      : null;

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { authProvider: 'APPLE', providerId: appleId },
          { email },
        ],
      },
    });

    if (user) {
      if (user.authProvider === 'EMAIL' && !user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: 'APPLE',
            providerId: appleId,
            emailVerified: true,
            name: user.name || displayName,
          },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: displayName,
          authProvider: 'APPLE',
          providerId: appleId,
          emailVerified: true, // Apple verifies email
          searchQuota: { create: { searchesUsed: 0 } },
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshTokenValue = await generateRefreshToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        householdSize: user.householdSize,
        plan: user.plan,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
        onboardingDone: user.onboardingDone,
      },
      accessToken,
      refreshToken: refreshTokenValue,
      isNewUser: !user.onboardingDone,
    });
  })
);

export default router;
