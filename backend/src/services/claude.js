// ============================================
// Claude AI Service — Universal recipe engine
// Handles all query types + cooking assistant
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
// Main search function — universal entry point
// ──────────────────────────────────────────

export async function searchRecipes(query, householdSize = 1, preferences = {}) {
  const cacheKey = generateCacheKey(query, householdSize);

  const cached = await cacheGet(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const searchResult = await searchWebForRecipes(query, householdSize, preferences);

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

  await cacheSet(cacheKey, result, 86400);

  return result;
}

// ──────────────────────────────────────────
// Step 1: Web search — universal prompt
// ──────────────────────────────────────────

async function searchWebForRecipes(query, householdSize, preferences) {
  const constraints = [];
  if (preferences.dietary?.length)
    constraints.push(`Kostpreferenser: ${preferences.dietary.join(', ')}.`);
  if (preferences.maxTimeMinutes)
    constraints.push(`Max tillagningstid: ${preferences.maxTimeMinutes} minuter.`);
  if (preferences.maxBudget)
    constraints.push(`Maxbudget: ${preferences.maxBudget} kr.`);
  if (preferences.occasion)
    constraints.push(`Tillfälle: ${preferences.occasion}.`);
  if (preferences.difficulty)
    constraints.push(`Svårighetsgrad: ${preferences.difficulty}.`);

  const constraintBlock = constraints.length > 0
    ? `\nBEGRÄNSNINGAR:\n${constraints.join('\n')}`
    : '';

  const householdLabel = getHouseholdLabel(householdSize);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [
      {
        role: 'user',
        content: `Du är MatKompass — en svensk AI-receptassistent i världsklass. Tolka användarens fråga intelligent och hitta de bästa recepten.

ANVÄNDARENS FRÅGA: "${query}"
HUSHÅLL: ${householdLabel} (${householdSize} portioner)
${constraintBlock}

TOLKA FRÅGAN:
- Ingredienser (t.ex. "kyckling, ris, grädde") → recept som använder dessa
- Specifik rätt (t.ex. "lasagne") → bästa receptet
- Huvudråvara (t.ex. "lax") → 2-3 varianter
- Budget/pris (t.ex. "billig middag under 50kr") → prisvänliga alternativ
- Tillfälle (t.ex. "festmiddag", "romantisk middag", "barnkalas") → passande recept
- Tid (t.ex. "snabb lunch", "20 min") → snabba alternativ
- Öppen fråga (t.ex. "vad ska jag laga?") → kreativa förslag
- Diet (t.ex. "veganskt", "glutenfritt") → anpassade recept
- Meal prep / veckomenyer → planera flera måltider

Sök på nätet efter 2-3 riktiga recept. Prioritera svenska receptsajter men inkludera internationella om de är relevanta.

För varje recept, samla in:
- Receptnamn och källa (sajt + URL)
- Fullständig ingredienslista med exakta mängder
- Detaljerat tillvägagångssätt steg för steg (nybörjarvänligt)
- Köksverktyg som behövs
- Ungefärlig tid (förberedelse + tillagning)
- Tips och varianter

Ge en utförlig sammanställning.`,
      },
    ],
  });

  let text = '';
  const sources = [];

  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text + '\n';
    }
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
  const sourcesStr = sources.map((s) => `- ${s.title}: ${s.url}`).join('\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 5000,
    messages: [
      {
        role: 'user',
        content: `Baserat på följande receptdata, skapa strukturerade recept.

RECEPTDATA:
${searchText}

KÄLLOR:
${sourcesStr}

SÖKNING: ${query}
HUSHÅLL: ${householdLabel} (${householdSize} portioner)

REGLER:
- Anpassa ALLA portioner till ${householdSize} portioner
- Markera ingredienser användaren sannolikt redan har (have: true)
- Inkludera ALLA köksverktyg
- Stegen ska vara MYCKET detaljerade — nybörjarvänliga
- Varje steg = EN tydlig instruktion
- Om ett steg har en väntetid (t.ex. "stek i 5 min"), inkludera duration_seconds
- Kostnadsuppskattningar i SEK (aktuella svenska priser)
- Kategorisera varje ingrediens efter butikshylla (aisle)
- Ge tips och varianter

Svara ENBART med giltig JSON (ingen markdown, inga backticks):
{
  "recipes": [
    {
      "title": "Receptnamn",
      "description": "Kort lockande beskrivning",
      "source_name": "ICA",
      "source_url": "https://...",
      "time_minutes": 20,
      "difficulty": "Enkel",
      "servings": ${householdSize},
      "cost_estimate": "ca 45 kr",
      "occasion": "vardag",
      "ingredients": [
        { "name": "Kyckling", "amount": "300g", "have": true, "aisle": "Kött & Fisk", "est_price": null },
        { "name": "Grädde", "amount": "2 dl", "have": false, "aisle": "Mejeri", "est_price": "15 kr" }
      ],
      "tools": ["Stekpanna", "Skärbräda", "Kniv"],
      "steps": [
        { "text": "Skär kycklingen i bitar.", "duration_seconds": null },
        { "text": "Stek kycklingen i 5 minuter.", "duration_seconds": 300 }
      ],
      "tips": "Tips och varianter här."
    }
  ],
  "shopping_list": [
    { "name": "Grädde", "amount": "2 dl", "est_price": "15 kr", "aisle": "Mejeri" }
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
    const match = cleanJSON.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse recipe JSON from AI response');
  }
}

// ──────────────────────────────────────────
// Cooking Assistant — real-time Q&A
// ──────────────────────────────────────────

export async function askCookingAssistant(recipe, question, conversationHistory = []) {
  const ingredientList = (recipe.ingredients || [])
    .map((i) => `${i.amount} ${i.name}`)
    .join(', ');

  const stepList = (recipe.steps || [])
    .map((s, i) => `${i + 1}. ${typeof s === 'string' ? s : s.text || s.content || ''}`)
    .join('\n');

  const messages = [
    {
      role: 'user',
      content: `Du är en erfaren svensk kock som hjälper en hemmalagare i realtid. Du är som en varm, professionell kompis i köket.

RECEPT: ${recipe.title}
INGREDIENSER: ${ingredientList}
STEG:
${stepList}
${recipe.tips ? `TIPS: ${recipe.tips}` : ''}

REGLER:
- Svara alltid på svenska
- Var kortfattad men tydlig (max 2-3 meningar)
- Ge exakta svar för timing/temperatur
- Varna proaktivt om något kan gå fel
- Ge alternativ om användaren saknar något
- Var uppmuntrande och personlig (du/dig)
- Om frågan inte handlar om matlagning, styr tillbaka vänligt`,
    },
    ...conversationHistory.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: question,
    },
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages,
  });

  const answer = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return { answer };
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

export function estimateApiCost() {
  return 0.07;
}
