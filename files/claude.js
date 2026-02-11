// ============================================
// Claude AI Service — Recipe generation
// with real web search
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import crypto from 'crypto';

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ──────────────────────────────────────────
// Cache key generation
// ──────────────────────────────────────────

export function generateCacheKey(query, householdSize) {
  const normalized = query
    .toLowerCase()
    .split(/[,\s]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .sort()
    .join('|');
  const raw = `${normalized}::${householdSize}`;
  return 'recipe:' + crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

// ──────────────────────────────────────────
// Main search function
// ──────────────────────────────────────────

/**
 * Searches for real recipes using Claude + web search,
 * then structures the results.
 *
 * @param {string} query - User's ingredient/recipe query
 * @param {number} householdSize - Number of people
 * @param {object} preferences - Optional dietary/time preferences
 * @returns {{ recipes: Array, shopping_list: Array, sources: Array, cached: boolean }}
 */
export async function searchRecipes(query, householdSize = 1, preferences = {}) {
  const cacheKey = generateCacheKey(query, householdSize);

  // Check cache first (24h TTL)
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  // ── Step 1: Search the web for real recipes ──
  const searchResult = await searchWebForRecipes(query, householdSize, preferences);

  // ── Step 2: Structure the results as JSON ──
  const structured = await structureRecipes(
    searchResult.text,
    searchResult.sources,
    query,
    householdSize,
    preferences
  );

  const result = {
    recipes: structured.recipes,
    shopping_list: structured.shopping_list,
    sources: searchResult.sources,
    cached: false,
  };

  // Cache for 24 hours
  await cacheSet(cacheKey, result, 86400);

  return result;
}

// ──────────────────────────────────────────
// Step 1: Web search via Claude
// ──────────────────────────────────────────

async function searchWebForRecipes(query, householdSize, preferences) {
  const dietaryStr = preferences.dietary?.length
    ? `Kostpreferenser: ${preferences.dietary.join(', ')}.`
    : '';
  const timeStr = preferences.maxTimeMinutes
    ? `Max tillagningstid: ${preferences.maxTimeMinutes} minuter.`
    : '';

  const householdLabel = getHouseholdLabel(householdSize);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [
      {
        role: 'user',
        content: `Du är en svensk receptexpert. En användare (${householdLabel}) söker recept med: "${query}"
${dietaryStr}
${timeStr}

Sök på nätet efter 2–3 riktiga, enkla och snabba recept som använder dessa ingredienser. 
Prioritera svenska receptsajter (ICA, Coop, Arla, Köket.se, Tasteline) men inkludera även internationella om de är relevanta.

För varje recept du hittar, samla in:
- Receptnamn och källa (sajt + URL)
- Fullständig ingredienslista med mängder
- Tillvägagångssätt steg för steg
- Vilka köksverktyg som behövs (stekpanna, ugn, mixer, etc.)
- Ungefärlig tid

Ge en utförlig sammanställning av vad du hittar.`,
      },
    ],
  });

  // Extract text and sources from response
  let text = '';
  const sources = [];

  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text + '\n';
    }
    // Extract sources from web search results
    if (block.type === 'web_search_tool_result') {
      for (const sr of block.content || []) {
        if (sr.type === 'web_search_result') {
          sources.push({
            title: sr.title,
            url: sr.url,
            snippet: sr.encrypted_content ? '[encrypted]' : '',
          });
        }
      }
    }
  }

  // Deduplicate sources
  const uniqueSources = [
    ...new Map(sources.map((s) => [s.url, s])).values(),
  ].slice(0, 8);

  return { text, sources: uniqueSources };
}

// ──────────────────────────────────────────
// Step 2: Structure as JSON
// ──────────────────────────────────────────

async function structureRecipes(searchText, sources, query, householdSize, preferences) {
  const householdLabel = getHouseholdLabel(householdSize);
  const sourcesStr = sources
    .map((s) => `- ${s.title}: ${s.url}`)
    .join('\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Baserat på följande receptdata från en webbsökning, skapa strukturerade recept.

RECEPTDATA:
${searchText}

KÄLLOR:
${sourcesStr}

ANVÄNDARENS INGREDIENSER: ${query}
HUSHÅLL: ${householdLabel} (${householdSize} portioner om inget annat anges)

REGLER:
- Anpassa portioner till hushållet
- Markera ingredienser användaren sannolikt redan har (have: true) baserat på deras sökning
- Inkludera ALLA köksverktyg som behövs
- Stegen ska vara tydliga och detaljerade
- Kostnadsuppskattningar i SEK baserat på svenska matpriser
- Om receptet kommer från en specifik källa, ange source_name och source_url

Svara ENBART med giltig JSON (ingen markdown, inga backticks, inget annat):
{
  "recipes": [
    {
      "title": "Receptnamn",
      "source_name": "ICA",
      "source_url": "https://...",
      "time_minutes": 20,
      "difficulty": "Enkel",
      "servings": ${householdSize},
      "cost_estimate": "ca 45 kr",
      "ingredients": [
        { "name": "Kyckling", "amount": "300g", "have": true },
        { "name": "Grädde", "amount": "2 dl", "have": false }
      ],
      "tools": ["Stekpanna", "Skärbräda", "Kniv"],
      "steps": [
        "Skär kycklingen i bitar och krydda med salt och peppar.",
        "Hetta upp stekpannan på medelhög värme med en skvätt olja."
      ],
      "tips": "Byt ut grädde mot kokosmjölk för en nyttigare variant."
    }
  ],
  "shopping_list": [
    { "name": "Grädde", "amount": "2 dl", "est_price": "15 kr" }
  ]
}`,
      },
    ],
  });

  const rawText = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  const cleanJSON = rawText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanJSON);
  } catch {
    // Try to extract JSON object
    const match = cleanJSON.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse recipe JSON from AI response');
  }
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function getHouseholdLabel(size) {
  if (size === 1) return '1 person (singel)';
  if (size === 2) return '2 personer (par)';
  if (size <= 4) return `${size} personer (familj)`;
  return `${size} personer (stor familj)`;
}

/**
 * Estimate API cost for a search (for tracking)
 */
export function estimateApiCost() {
  // Rough estimate: 2 API calls per search
  // Claude Sonnet: ~$3/M input, ~$15/M output
  // ~2000 input tokens + ~2000 output tokens per call × 2 calls
  // ≈ $0.012 + $0.06 = ~$0.07 per search
  return 0.07;
}
