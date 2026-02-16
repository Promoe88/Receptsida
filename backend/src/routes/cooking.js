// ============================================
// Cooking Session Routes — Real-time voice/text cooking assistant
// ============================================

import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();
const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ──────────────────────────────────────────
// In-memory conversation store (→ Redis later)
// ──────────────────────────────────────────

const sessions = new Map();

const MAX_HISTORY = 20;
const SESSION_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

// Clean up expired sessions every 30 min
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of sessions) {
    if (now - session.updatedAt > SESSION_TTL_MS) {
      sessions.delete(key);
    }
  }
}, 30 * 60 * 1000);

// ──────────────────────────────────────────
// System prompt for cooking coach
// ──────────────────────────────────────────

const COOKING_SYSTEM = `Du är Nisse — en professionell kockassistent som guidar användaren steg-för-steg under matlagningen.

Kärnprinciper:
- Känn av användarens erfarenhet från hur de uttrycker sig
- Nybörjare: Förklara varje steg, ge tidsuppskattningar, varna för vanliga misstag
- Erfarna: Var koncis, föreslå variationer, nämn professionella tekniker
- Var kortfattad men tydlig — användaren lagar mat och har händerna fulla
- Ge exakta svar för timing/temperatur
- Varna proaktivt om något kan gå fel
- Ge alternativ om användaren saknar något
- Var uppmuntrande och personlig (du/dig)
- Svara alltid på svenska

ACTIONS — Om ditt svar naturligt leder till en av dessa åtgärder, avsluta med en rad i exakt detta format:
[ACTION:action_name] eller [ACTION:action_name:param]

Tillgängliga actions:
- [ACTION:next_step] — när användaren är klar och bör gå vidare
- [ACTION:prev_step] — om användaren vill gå tillbaka
- [ACTION:set_timer:SEKUNDER] — när ett steg kräver väntan (t.ex. [ACTION:set_timer:300] för 5 min)
- [ACTION:done] — när receptet är helt klart

Lägg BARA till en action om det är naturligt. Om användaren bara ställer en fråga, behövs ingen action.`;

// ──────────────────────────────────────────
// POST /speak — Cooking assistant interaction
// ──────────────────────────────────────────

router.post(
  '/speak',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { message, session_id, recipe_id, current_step } = req.body;

    if (!message || !session_id) {
      throw new AppError(400, 'bad_request', 'message och session_id krävs.');
    }

    // Get or create session
    if (!sessions.has(session_id)) {
      sessions.set(session_id, { history: [], recipeId: recipe_id, updatedAt: Date.now() });
    }

    const session = sessions.get(session_id);
    session.updatedAt = Date.now();

    if (recipe_id) {
      session.recipeId = recipe_id;
    }

    // Build step context
    const stepContext = current_step !== undefined && current_step !== null
      ? `\n\nAnvändaren är just nu på steg ${current_step + 1}.`
      : '';

    const recipeContext = session.recipeId
      ? `\nRecept-ID: ${session.recipeId}`
      : '';

    // Build messages array with history
    const messages = [
      ...session.history.slice(-MAX_HISTORY),
      { role: 'user', content: message },
    ];

    // Call Claude with streaming
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: `${COOKING_SYSTEM}${recipeContext}${stepContext}`,
      messages,
    });

    const response = await stream.finalMessage();

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    // Parse action from response
    const { text, action } = parseAction(rawText);

    // Save to conversation history
    session.history.push({ role: 'user', content: message });
    session.history.push({ role: 'assistant', content: text });

    // Trim history
    if (session.history.length > MAX_HISTORY) {
      session.history = session.history.slice(-MAX_HISTORY);
    }

    res.json({ text, action });
  })
);

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function parseAction(rawText) {
  const actionRegex = /\[ACTION:(\w+)(?::(\w+))?\]\s*$/;
  const match = rawText.match(actionRegex);

  if (!match) {
    return { text: rawText.trim(), action: null };
  }

  const text = rawText.replace(actionRegex, '').trim();
  const actionName = match[1];
  const actionParam = match[2] || null;

  const action = { type: actionName };
  if (actionParam) {
    action.param = isNaN(actionParam) ? actionParam : Number(actionParam);
  }

  return { text, action };
}

export default router;
