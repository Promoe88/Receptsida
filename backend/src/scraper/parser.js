// ============================================
// Recipe Parser — Extract structured recipe data
// ============================================
// Extracts schema.org/Recipe JSON-LD from HTML pages.
// Falls back to microdata and meta tags if JSON-LD
// is not available.

import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Parse an HTML page and extract recipe data
 *
 * @param {string} html - Raw HTML content
 * @param {string} url - Source URL (for metadata)
 * @returns {object|null} Parsed recipe or null if not found
 */
export function parseRecipePage(html, url) {
  const $ = cheerio.load(html);

  // Try JSON-LD first (most reliable)
  let recipe = extractJsonLd($);

  // Fallback: look for microdata
  if (!recipe) {
    recipe = extractMicrodata($);
  }

  if (!recipe) return null;

  // Normalize and clean the data
  return normalizeRecipe(recipe, url, $);
}

/**
 * Extract schema.org/Recipe from JSON-LD script tags
 */
function extractJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');
  let recipe = null;

  scripts.each((_, el) => {
    if (recipe) return; // Already found

    try {
      const raw = $(el).html();
      if (!raw) return;

      const data = JSON.parse(raw);

      // Could be a single object or an array
      const candidates = Array.isArray(data) ? data : [data];

      for (const item of candidates) {
        // Direct Recipe type
        if (isRecipeType(item)) {
          recipe = item;
          return;
        }

        // Nested in @graph
        if (item['@graph'] && Array.isArray(item['@graph'])) {
          const found = item['@graph'].find(isRecipeType);
          if (found) {
            recipe = found;
            return;
          }
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  });

  return recipe;
}

/**
 * Check if a JSON-LD object is a Recipe type
 */
function isRecipeType(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const type = obj['@type'];
  if (typeof type === 'string') return type === 'Recipe';
  if (Array.isArray(type)) return type.includes('Recipe');
  return false;
}

/**
 * Fallback: extract recipe from microdata (itemprop attributes)
 */
function extractMicrodata($) {
  const recipeEl = $('[itemtype*="schema.org/Recipe"]');
  if (recipeEl.length === 0) return null;

  const recipe = {};

  const prop = (name) => {
    const el = recipeEl.find(`[itemprop="${name}"]`);
    return el.attr('content') || el.text().trim() || null;
  };

  recipe.name = prop('name');
  recipe.description = prop('description');
  recipe.image = recipeEl.find('[itemprop="image"]').attr('src') || prop('image');
  recipe.totalTime = prop('totalTime');
  recipe.prepTime = prop('prepTime');
  recipe.cookTime = prop('cookTime');
  recipe.recipeYield = prop('recipeYield');
  recipe.recipeCategory = prop('recipeCategory');
  recipe.recipeCuisine = prop('recipeCuisine');
  recipe.author = prop('author');

  // Ingredients
  const ingredients = [];
  recipeEl.find('[itemprop="recipeIngredient"], [itemprop="ingredients"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text) ingredients.push(text);
  });
  recipe.recipeIngredient = ingredients;

  // Instructions
  const instructions = [];
  recipeEl.find('[itemprop="recipeInstructions"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text) instructions.push(text);
  });
  recipe.recipeInstructions = instructions;

  return recipe.name ? recipe : null;
}

/**
 * Normalize raw schema.org data into our database format
 */
function normalizeRecipe(raw, url, $) {
  const urlHash = crypto.createHash('sha256').update(url).digest('hex');

  // Parse title
  const title = raw.name || raw.headline || $('title').text().trim();
  if (!title) return null;

  // Parse description
  const description = raw.description || null;

  // Parse image
  let imageUrl = null;
  if (raw.image) {
    if (typeof raw.image === 'string') {
      imageUrl = raw.image;
    } else if (Array.isArray(raw.image)) {
      imageUrl = typeof raw.image[0] === 'string' ? raw.image[0] : raw.image[0]?.url;
    } else if (raw.image?.url) {
      imageUrl = raw.image.url;
    }
  }

  // Parse times (ISO 8601 duration → minutes)
  const totalTime = parseDuration(raw.totalTime);
  const prepTime = parseDuration(raw.prepTime);
  const cookTime = parseDuration(raw.cookTime);

  // Parse servings
  const servingsRaw = raw.recipeYield;
  let servings = null;
  let servingsNum = null;
  if (servingsRaw) {
    if (typeof servingsRaw === 'number') {
      servingsNum = servingsRaw;
      servings = `${servingsRaw} portioner`;
    } else if (Array.isArray(servingsRaw)) {
      servings = servingsRaw[0]?.toString();
      servingsNum = parseInt(servingsRaw[0]) || null;
    } else {
      servings = servingsRaw.toString();
      servingsNum = parseInt(servingsRaw) || null;
    }
  }

  // Parse category
  const category = raw.recipeCategory
    ? (Array.isArray(raw.recipeCategory) ? raw.recipeCategory[0] : raw.recipeCategory)
    : null;

  // Parse cuisine
  const cuisine = raw.recipeCuisine
    ? (Array.isArray(raw.recipeCuisine) ? raw.recipeCuisine[0] : raw.recipeCuisine)
    : null;

  // Parse tags/keywords
  let tags = [];
  if (raw.keywords) {
    if (typeof raw.keywords === 'string') {
      tags = raw.keywords.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(raw.keywords)) {
      tags = raw.keywords.map((t) => t.toString().trim()).filter(Boolean);
    }
  }

  // Parse rating
  let rating = null;
  let ratingCount = null;
  if (raw.aggregateRating) {
    rating = parseFloat(raw.aggregateRating.ratingValue) || null;
    ratingCount = parseInt(raw.aggregateRating.ratingCount || raw.aggregateRating.reviewCount) || null;
  }

  // Parse author
  let author = null;
  if (raw.author) {
    if (typeof raw.author === 'string') {
      author = raw.author;
    } else if (Array.isArray(raw.author)) {
      author = raw.author[0]?.name || raw.author[0]?.toString();
    } else {
      author = raw.author.name || null;
    }
  }

  // Parse ingredients
  const ingredients = parseIngredients(raw.recipeIngredient || []);

  // Parse instructions
  const steps = parseInstructions(raw.recipeInstructions || []);

  // Require at least a title and some ingredients
  if (!title || ingredients.length === 0) return null;

  return {
    urlHash,
    title: cleanText(title),
    description: description ? cleanText(description) : null,
    sourceUrl: url,
    sourceDomain: extractDomain(url),
    imageUrl,
    totalTime,
    prepTime,
    cookTime,
    servings,
    servingsNum,
    category: category ? cleanText(category) : null,
    cuisine: cuisine ? cleanText(cuisine) : null,
    tags,
    rating,
    ratingCount,
    author: author ? cleanText(author) : null,
    rawJsonLd: raw,
    ingredients,
    steps,
  };
}

/**
 * Parse ISO 8601 duration (PT30M, PT1H15M, etc.) to minutes
 */
function parseDuration(str) {
  if (!str || typeof str !== 'string') return null;

  const match = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return null;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 60 + minutes + Math.ceil(seconds / 60) || null;
}

/**
 * Parse ingredient list into structured data
 */
function parseIngredients(rawList) {
  if (!Array.isArray(rawList)) return [];

  return rawList
    .map((item, idx) => {
      const raw = typeof item === 'string' ? item.trim() : item?.text?.trim() || '';
      if (!raw) return null;

      const parsed = parseIngredientLine(raw);
      return {
        raw,
        name: parsed.name,
        amount: parsed.amount,
        unit: parsed.unit,
        sortOrder: idx,
      };
    })
    .filter(Boolean);
}

/**
 * Parse a single ingredient line into amount, unit, name
 * e.g. "2 dl vispgrädde" → { amount: "2", unit: "dl", name: "vispgrädde" }
 */
function parseIngredientLine(line) {
  const cleaned = line.replace(/\s+/g, ' ').trim();

  // Common Swedish units
  const unitPattern = /^([\d½¼¾⅓⅔,./\s-]+)\s*(dl|cl|ml|l|msk|tsk|krm|st|kg|g|port|förp|burk|pkt|påse|näve|knippe)\b\.?\s*(.+)/i;
  const match = cleaned.match(unitPattern);

  if (match) {
    return {
      amount: match[1].trim(),
      unit: match[2].toLowerCase(),
      name: match[3].trim(),
    };
  }

  // Just a number + name (e.g. "3 ägg")
  const numMatch = cleaned.match(/^([\d½¼¾⅓⅔,./\s-]+)\s+(.+)/);
  if (numMatch) {
    return {
      amount: numMatch[1].trim(),
      unit: null,
      name: numMatch[2].trim(),
    };
  }

  // No amount (e.g. "salt och peppar")
  return {
    amount: null,
    unit: null,
    name: cleaned,
  };
}

/**
 * Parse instructions into step list
 */
function parseInstructions(raw) {
  if (!raw) return [];

  // Can be a string, array of strings, or array of HowToStep objects
  if (typeof raw === 'string') {
    return raw
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((content, idx) => ({ content: cleanText(content), sortOrder: idx }));
  }

  if (!Array.isArray(raw)) return [];

  const steps = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const text = item.trim();
      if (text) steps.push({ content: cleanText(text), sortOrder: steps.length });
    } else if (item?.['@type'] === 'HowToSection') {
      // Nested section with steps
      const sectionSteps = item.itemListElement || [];
      for (const step of sectionSteps) {
        const text = step.text || step.name || '';
        if (text.trim()) {
          steps.push({ content: cleanText(text.trim()), sortOrder: steps.length });
        }
      }
    } else if (item?.text) {
      steps.push({ content: cleanText(item.text.trim()), sortOrder: steps.length });
    } else if (item?.name) {
      steps.push({ content: cleanText(item.name.trim()), sortOrder: steps.length });
    }
  }

  return steps;
}

/**
 * Clean text: remove extra whitespace, HTML entities
 */
function cleanText(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '') // Strip HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}
