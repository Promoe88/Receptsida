// ============================================
// Lexicon Builder — Build word database from
// scraped recipes
// ============================================
// Processes all scraped recipes to extract and
// categorize every food-related word, building
// a comprehensive Swedish recipe lexicon.

import { prisma } from '../config/db.js';

// ──────────────────────────────────────────
// Swedish measurement units
// ──────────────────────────────────────────
const UNITS = new Set([
  'dl', 'cl', 'ml', 'l', 'liter',
  'msk', 'tsk', 'krm',
  'g', 'kg', 'hg',
  'st', 'stycken', 'styck',
  'port', 'portioner',
  'förp', 'förpackning', 'paket', 'pkt',
  'burk', 'burkar',
  'påse', 'påsar',
  'näve', 'knippe', 'skiva', 'skivor',
  'klyfta', 'klyftor', 'bit', 'bitar',
]);

// ──────────────────────────────────────────
// Cooking technique verbs (Swedish)
// ──────────────────────────────────────────
const TECHNIQUES = new Set([
  'stek', 'steka', 'steks', 'stekt',
  'koka', 'kokas', 'kokt',
  'grilla', 'grillas', 'grillat', 'grillad',
  'baka', 'bakas', 'bakat', 'bakad',
  'fräs', 'fräsa', 'fräst',
  'bryn', 'bryna', 'brynt', 'bryns',
  'sjud', 'sjuda', 'sjuds',
  'ångkoka', 'ångkokt',
  'fritera', 'friterad', 'friteras',
  'ugnstek', 'ugnssteka', 'ugnsstekas',
  'woka', 'wokad', 'wokas',
  'marinera', 'marinerad', 'marineras',
  'reducera', 'reducerad', 'reduceras',
  'vispa', 'vispas', 'vispat', 'vispad',
  'blanda', 'blandas', 'blandat',
  'rör', 'röra', 'rörs',
  'hacka', 'hackad', 'hackas', 'hackat',
  'skär', 'skära', 'skärs', 'skuren',
  'riva', 'riven', 'rivs', 'rivet',
  'pressa', 'pressad', 'pressas',
  'mortla', 'mortlad',
  'smälta', 'smält', 'smälts',
  'sila', 'silas', 'silad',
  'mixa', 'mixas', 'mixat', 'mixad',
  'knåda', 'knådas', 'knådat',
  'jäsa', 'jäsas', 'jäst',
  'hälla', 'hälls',
  'tillsätt', 'tillsätta', 'tillsätts',
]);

// ──────────────────────────────────────────
// Kitchen tools (Swedish)
// ──────────────────────────────────────────
const TOOLS = new Set([
  'stekpanna', 'kastrull', 'gryta', 'ugn',
  'ugnsform', 'plåt', 'bakplåt', 'ugnsplåt',
  'kniv', 'skärbräda', 'rivjärn',
  'mixer', 'stavmixer', 'matberedare',
  'visp', 'elvisp', 'ballongvisp',
  'bunke', 'skål', 'sleev', 'slev',
  'stekspade', 'tång', 'sked',
  'mått', 'decilitermått', 'våg',
  'durkslag', 'sil', 'tratt',
  'bakform', 'springform', 'muffinsform',
  'brödform', 'pajform', 'gratängform',
  'termometer', 'timer', 'folie',
  'bakplåtspapper', 'plastfolie',
  'mortel', 'pepparkvarn',
  'wok', 'wokpanna',
  'långpanna', 'plåt',
]);

// ──────────────────────────────────────────
// Descriptor words (size, state, temperature)
// ──────────────────────────────────────────
const DESCRIPTORS = new Set([
  'färsk', 'färska', 'fryst', 'frysta', 'fryst',
  'torkad', 'torkade', 'rökt', 'rökta',
  'skivad', 'skivade', 'hackad', 'hackade',
  'riven', 'rivna', 'krossad', 'krossade',
  'fin', 'fint', 'fina', 'grov', 'grovt', 'grova',
  'stor', 'stort', 'stora', 'liten', 'litet', 'små',
  'varm', 'varmt', 'varma', 'kall', 'kallt', 'kalla',
  'hel', 'helt', 'hela', 'halv', 'halvt', 'halva',
  'mogen', 'moget', 'mogna',
  'skalad', 'skalade', 'oskalad', 'oskalade',
  'kokta', 'kokt', 'stekt', 'stekta',
  'pressad', 'pressade',
  'ekologisk', 'ekologiskt', 'ekologiska',
  'svensk', 'svenskt', 'svenska',
]);

// ──────────────────────────────────────────
// Stop words to exclude
// ──────────────────────────────────────────
const STOP_WORDS = new Set([
  'och', 'eller', 'med', 'till', 'i', 'på', 'av', 'för',
  'den', 'det', 'de', 'en', 'ett', 'som', 'att', 'är',
  'var', 'har', 'hade', 'kan', 'ska', 'vill', 'bör',
  'efter', 'sedan', 'under', 'över', 'ca', 'circa', 'ungefär',
  'lite', 'mycket', 'mer', 'mest', 'minst', 'några',
  'eventuellt', 'gärna', 'valfritt', 'alternativt',
  'servering', 'topping', 'garnering',
]);

// Ingredient categories based on common patterns
const INGREDIENT_CATEGORIES = {
  protein: /(?:kyckling|nöt|fläsk|lax|torsk|räk|ägg|tofu|biff|korv|bacon|skink|kassler|lamm|anka|vilt|köttfärs|blandfärs|kycklingfärs|fläskfärs|oxfilé|entrecôte|ryggbiff|schnitzel|kotlett|revben|bog|filé|bröst|lår|vinge)/i,
  mejeri: /(?:mjölk|grädde|smör|ost|yoghurt|kvarg|crème|créme|gräddfil|kesella|ricotta|mascarpone|mozzarella|parmesan|cheddar|brie|fetaost|halloumi|cottage)/i,
  grönsak: /(?:tomat|lök|vitlök|paprika|morot|broccoli|spenat|gurka|sallad|zucchini|champinjon|svamp|avokado|majs|ärtor|bönor|selleri|blomkål|sötpotatis|pumpa|squash|rödbet|kål|vitkål|rödkål|aubergine|fänkål|sparris|purjolök|rädisor)/i,
  frukt: /(?:äpple|päron|banan|citron|lime|apelsin|mango|ananas|bär|hallon|blåbär|jordgubb|körsbär|vindruv|melon|kiwi|passionsfrukt|fikon|dadel|russin|plommon|persik)/i,
  kolhydrat: /(?:pasta|ris|potatis|bröd|nudl|couscous|bulgur|tortilla|mjöl|vetemjöl|dinkel|havre|quinoa|spaghetti|penne|fusilli|makaroner|tagliatelle|lasagne)/i,
  krydda: /(?:salt|peppar|olivolja|soja|curry|chili|basilika|oregano|timjan|rosmarin|kummin|paprikapulver|ingefära|kanel|kardemumma|muskotnöt|saffran|dill|persilja|gräslök|koriander|mynta|salvia|dragon|lagerblad)/i,
  övrigt: /(?:socker|honung|sirap|vinäger|buljong|fond|kokosmjölk|gräddfil|senap|ketchup|majonnäs|vin|öl|vatten|olja|nöt|mandel|cashew|pinj|sesam|solros|vallmo|linser|kikärt)/i,
};

/**
 * Build the recipe word lexicon from all scraped recipes
 */
export async function buildLexicon() {
  console.log('📖 Building recipe lexicon from scraped data...');

  // Get all scraped ingredients
  const ingredients = await prisma.scrapedIngredient.findMany({
    select: { raw: true, name: true, unit: true },
  });

  // Get all scraped steps (for technique & tool words)
  const steps = await prisma.scrapedStep.findMany({
    select: { content: true },
  });

  console.log(`  📊 Processing ${ingredients.length} ingredients and ${steps.length} steps...`);

  // Word frequency map: word → { count, category, contexts }
  const wordMap = new Map();

  // Process ingredients
  for (const ing of ingredients) {
    const words = tokenize(ing.name || ing.raw);
    for (const word of words) {
      if (STOP_WORDS.has(word)) continue;
      if (UNITS.has(word)) {
        addWord(wordMap, word, 'measurement');
        continue;
      }
      if (DESCRIPTORS.has(word)) {
        addWord(wordMap, word, 'descriptor');
        continue;
      }

      // Categorize as ingredient
      const cat = categorizeIngredient(word);
      addWord(wordMap, word, cat);
    }
  }

  // Process steps for techniques and tools
  for (const step of steps) {
    const words = tokenize(step.content);
    for (const word of words) {
      if (STOP_WORDS.has(word)) continue;

      if (TECHNIQUES.has(word)) {
        addWord(wordMap, word, 'technique');
      } else if (TOOLS.has(word)) {
        addWord(wordMap, word, 'tool');
      }
      // Don't add random step words to the lexicon
    }
  }

  console.log(`  📝 Found ${wordMap.size} unique words`);

  // Build synonym groups
  const synonymGroups = buildSynonymGroups(wordMap);

  // Save to database
  let saved = 0;
  const batchSize = 100;
  const entries = [...wordMap.entries()];

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);

    for (const [word, data] of batch) {
      const canonical = getCanonical(word, synonymGroups);
      const synonyms = getSynonyms(word, synonymGroups);
      const emoji = getEmoji(word, data.category);

      try {
        await prisma.recipeWord.upsert({
          where: { word },
          create: {
            word,
            canonical,
            category: data.category,
            frequency: data.count,
            synonyms,
            relatedWords: [],
            emoji,
          },
          update: {
            frequency: data.count,
            category: data.category,
            canonical,
            synonyms,
            emoji,
          },
        });
        saved++;
      } catch (err) {
        // Skip duplicates
        if (err.code !== 'P2002') {
          console.error(`  ⚠️ Failed to save word "${word}":`, err.message);
        }
      }
    }

    console.log(`  💾 Saved ${Math.min(i + batchSize, entries.length)}/${entries.length} words...`);
  }

  // Also update the LexiconEntry table with newly discovered ingredients
  await enrichLexiconEntries(wordMap);

  const stats = {
    totalWords: wordMap.size,
    saved,
    byCategory: getCategoryStats(wordMap),
  };

  console.log('✅ Lexicon built successfully:', stats);
  return stats;
}

/**
 * Tokenize text into clean words
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}""'']/g, ' ')
    .replace(/\d+/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
}

/**
 * Add/increment a word in the word map
 */
function addWord(map, word, category) {
  const existing = map.get(word);
  if (existing) {
    existing.count++;
    // Keep most specific category
    if (category !== 'ingredient' && existing.category === 'ingredient') {
      existing.category = category;
    }
  } else {
    map.set(word, { count: 1, category });
  }
}

/**
 * Categorize an ingredient word
 */
function categorizeIngredient(word) {
  for (const [cat, pattern] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (pattern.test(word)) return cat;
  }
  return 'ingredient'; // Generic ingredient
}

/**
 * Build synonym groups from similar words
 */
function buildSynonymGroups(wordMap) {
  const groups = new Map();
  const words = [...wordMap.keys()].sort();

  for (const word of words) {
    // Find if this word is a suffix/prefix variant of another
    let matched = false;
    for (const [canonical, group] of groups) {
      if (
        word.startsWith(canonical) ||
        canonical.startsWith(word) ||
        (word.length > 3 && canonical.length > 3 && levenshtein(word, canonical) <= 2)
      ) {
        group.push(word);
        matched = true;
        break;
      }
    }
    if (!matched) {
      groups.set(word, [word]);
    }
  }

  return groups;
}

/**
 * Get canonical form for a word
 */
function getCanonical(word, synonymGroups) {
  for (const [canonical, group] of synonymGroups) {
    if (group.includes(word)) {
      return canonical;
    }
  }
  return word;
}

/**
 * Get synonyms for a word
 */
function getSynonyms(word, synonymGroups) {
  for (const [, group] of synonymGroups) {
    if (group.includes(word) && group.length > 1) {
      return group.filter((w) => w !== word);
    }
  }
  return [];
}

/**
 * Get emoji for a word based on category
 */
function getEmoji(word, category) {
  const emojiMap = {
    protein: '🥩', mejeri: '🥛', grönsak: '🥬', frukt: '🍎',
    kolhydrat: '🍞', krydda: '🌿', technique: '👨‍🍳', tool: '🍳',
    measurement: '📏', descriptor: '📝', ingredient: '🧂', övrigt: '🫙',
  };
  return emojiMap[category] || '📝';
}

/**
 * Simple Levenshtein distance
 */
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Get category statistics from word map
 */
function getCategoryStats(wordMap) {
  const stats = {};
  for (const [, data] of wordMap) {
    stats[data.category] = (stats[data.category] || 0) + 1;
  }
  return stats;
}

/**
 * Enrich the original LexiconEntry table with
 * high-frequency ingredient words from scraped data
 */
async function enrichLexiconEntries(wordMap) {
  const ingredientCategories = ['protein', 'mejeri', 'grönsak', 'frukt', 'kolhydrat', 'krydda', 'övrigt'];

  let added = 0;
  for (const [word, data] of wordMap) {
    if (!ingredientCategories.includes(data.category)) continue;
    if (data.count < 3) continue; // Only add frequently used ingredients

    try {
      await prisma.lexiconEntry.upsert({
        where: { word },
        create: {
          word,
          canonical: word,
          category: data.category,
          synonyms: [],
          emoji: getEmoji(word, data.category),
        },
        update: {}, // Don't overwrite existing entries
      });
      added++;
    } catch {
      // Skip
    }
  }

  if (added > 0) {
    console.log(`  🔄 Enriched LexiconEntry table with ${added} new ingredients`);
  }
}

/**
 * Get lexicon statistics
 */
export async function getLexiconStats() {
  const [total, byCategory, topWords] = await Promise.all([
    prisma.recipeWord.count(),
    prisma.recipeWord.groupBy({
      by: ['category'],
      _count: true,
      orderBy: { _count: { category: 'desc' } },
    }),
    prisma.recipeWord.findMany({
      orderBy: { frequency: 'desc' },
      take: 50,
      select: {
        word: true,
        canonical: true,
        category: true,
        frequency: true,
        emoji: true,
      },
    }),
  ]);

  return {
    totalWords: total,
    byCategory: byCategory.map((c) => ({
      category: c.category,
      count: c._count,
    })),
    topWords,
  };
}

/**
 * Search the recipe word lexicon
 */
export async function searchLexicon(query, category = null, limit = 20) {
  const where = {
    OR: [
      { word: { contains: query.toLowerCase() } },
      { canonical: { contains: query.toLowerCase() } },
    ],
  };

  if (category) {
    where.category = category;
  }

  return prisma.recipeWord.findMany({
    where,
    orderBy: { frequency: 'desc' },
    take: limit,
  });
}
