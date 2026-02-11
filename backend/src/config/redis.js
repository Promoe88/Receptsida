// ============================================
// Redis Client — Caching & Rate Limiting
// ============================================

import Redis from 'ioredis';
import { config, isDev } from './env.js';

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  if (isDev) console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

// ──────────────────────────────────────────
// Cache helpers
// ──────────────────────────────────────────

/**
 * Get cached value, parsed from JSON
 */
export async function cacheGet(key) {
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

/**
 * Set cache with TTL (seconds)
 */
export async function cacheSet(key, value, ttlSeconds = 86400) {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error('Cache set error:', err.message);
  }
}

/**
 * Delete cache entry
 */
export async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('Cache del error:', err.message);
  }
}

/**
 * Sliding window rate limiter
 * Returns { allowed: boolean, remaining: number, resetIn: number }
 */
export async function checkRateLimit(key, maxRequests, windowSeconds) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();
  const count = results[2][1];

  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetIn: windowSeconds,
  };
}
