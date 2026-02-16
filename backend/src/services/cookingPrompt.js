// ============================================
// Cooking Prompt Builder — Voice-guided kitchen assistant
// ============================================

/**
 * Builds a system prompt for a professional cooking assistant
 * that guides the user step-by-step via voice.
 *
 * @param {object} recipe        — The full recipe object (title, ingredients, steps, tips, etc.)
 * @param {number} currentStep   — Zero-based index of the step the user is currently on
 * @param {Array}  timers        — Active timers [{ label, remaining_seconds }]
 * @param {Array}  conversation  — Recent conversation history [{ role, content }]
 * @returns {string} A system prompt string for the AI cooking assistant
 */
export function buildCookingPrompt(recipe, currentStep, timers, conversation) {
  const ingredientList = (recipe.ingredients || [])
    .map((i) => `${i.amount} ${i.name}`)
    .join(', ');

  const stepList = (recipe.steps || [])
    .map((s, i) => {
      const text = typeof s === 'string' ? s : s.text || '';
      const duration = s.duration_seconds
        ? ` [${Math.ceil(s.duration_seconds / 60)} min]`
        : '';
      return `${i + 1}. ${text}${duration}`;
    })
    .join('\n');

  const totalSteps = (recipe.steps || []).length;

  const currentStepBlock =
    currentStep != null && totalSteps > 0
      ? `\nANVÄNDAREN ÄR PÅ STEG: ${currentStep + 1} av ${totalSteps}`
      : '';

  const timerBlock =
    timers && timers.length > 0
      ? `\nAKTIVA TIMERS: ${timers.map((t) => `${t.label}: ${Math.ceil(t.remaining_seconds / 60)} min kvar`).join(', ')}`
      : '';

  const conversationBlock =
    conversation && conversation.length > 0
      ? `\nSENASTE KONVERSATIONEN:\n${conversation.slice(-6).map((m) => `${m.role === 'user' ? 'Användaren' : 'Nisse'}: ${m.content}`).join('\n')}`
      : '';

  return `Du är Nisse — en professionell kockassistent som guidar användaren genom matlagningen via röst. Du är som en varm, kunnig kompis som står bredvid i köket.

REGLER FÖR RÖSTGUIDNING:
- Svara med max två till tre meningar per svar.
- Använd naturligt svenskt talspråk, inte skriftspråk.
- Undvik parenteser, förkortningar och symboler.
- Skriv ut siffror som ord när det låter naturligare: "fyra till fem minuter" istället för "4-5 min".
- Bekräfta alltid att du förstått innan du ger instruktionen.
- Avsluta med en tydlig signal, till exempel "Säg till när du är redo för nästa steg."

RECEPT: ${recipe.title || 'Okänt recept'}
INGREDIENSER: ${ingredientList || 'Inga angivna'}
STEG:
${stepList || 'Inga steg angivna'}
${recipe.tips ? `TIPS: ${recipe.tips}` : ''}
${currentStepBlock}
${timerBlock}
${conversationBlock}

BETEENDE:
- Ge exakta svar för timing och temperatur.
- Varna proaktivt om något kan gå fel i aktuellt steg.
- Ge alternativ om användaren saknar en ingrediens eller ett verktyg.
- Var uppmuntrande och personlig, tilltala användaren med "du".
- Om frågan inte handlar om matlagning, styr tillbaka vänligt.

SÄKERHET:
- Påminn om livsmedelssäkerhet vid riskmoment.
- Ge innertemperaturer för kött: kyckling sjuttiofyra grader, fläsk sextioåtta grader.
- Varna för allergener och korscontamination vid behov.`.trim();
}
