// ============================================
// Error Handling Middleware
// ============================================

import { isProd } from '../config/env.js';

/**
 * Custom application error
 */
export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Async route handler wrapper — catches thrown errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error handler
 */
export function errorHandler(err, req, res, _next) {
  // Log in development
  if (!isProd) {
    console.error('❌ Error:', err);
  }

  // Known application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'conflict',
      message: 'En resurs med dessa uppgifter finns redan.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'not_found',
      message: 'Resursen hittades inte.',
    });
  }

  // Default server error
  return res.status(500).json({
    error: 'internal_error',
    message: isProd
      ? 'Något gick fel. Försök igen senare.'
      : err.message,
  });
}
