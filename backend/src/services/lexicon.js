// ============================================
// Lexicon Service — Ingredient dictionary
// ============================================

import { prisma } from '../config/db.js';
import { cacheGet, cacheSet } from '../config/redis.js';

/**
 * Autocomplete search — returns matching ingredients
 * Uses Redis cache for the full lexicon, falls back to DB
 */
export async function suggestIngredients(prefix, limit = 8) {
  if (!prefix || prefix.length < 1) return [];

  const normalizedPrefix = prefix.toLowerCase().trim();

  // Try to get from cached full list
  let lexicon = await cacheGet('lexicon:all');

  if (!lexicon) {
    // Load from DB and cache
    lexicon = await prisma.lexiconEntry.findMany({
      select: {
        word: true,
        canonical: true,
        category: true,
        emoji: true,
        synonyms: true,
      },
    });
    await cacheSet('lexicon:all', lexicon, 3600); // 1 hour
  }

  // Match against word, canonical, and synonyms
  const matches = lexicon
    .filter((entry) => {
      if (entry.word.toLowerCase().startsWith(normalizedPrefix)) return true;
      if (entry.canonical.toLowerCase().startsWith(normalizedPrefix)) return true;
      return entry.synonyms.some((s) =>
        s.toLowerCase().startsWith(normalizedPrefix)
      );
    })
    .slice(0, limit)
    .map((entry) => ({
      word: entry.word,
      canonical: entry.canonical,
      category: entry.category,
      emoji: entry.emoji,
    }));

  return matches;
}

/**
 * Parse a free-text query into recognized ingredients
 */
export async function parseIngredients(query) {
  const words = query
    .toLowerCase()
    .split(/[,;\s]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);

  let lexicon = await cacheGet('lexicon:all');
  if (!lexicon) {
    lexicon = await prisma.lexiconEntry.findMany();
    await cacheSet('lexicon:all', lexicon, 3600);
  }

  const recognized = [];
  const unrecognized = [];

  for (const word of words) {
    const match = lexicon.find((entry) => {
      if (entry.word.toLowerCase() === word) return true;
      if (entry.canonical.toLowerCase() === word) return true;
      return entry.synonyms.some((s) => s.toLowerCase() === word);
    });

    if (match) {
      recognized.push({
        input: word,
        canonical: match.canonical,
        category: match.category,
        emoji: match.emoji,
      });
    } else {
      unrecognized.push(word);
    }
  }

  return { recognized, unrecognized };
}
