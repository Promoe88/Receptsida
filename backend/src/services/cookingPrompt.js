// ============================================
// Cooking Prompt Builder — Voice-guided cooking assistant
// ============================================

/**
 * Builds a system prompt for the voice-guided cooking assistant.
 *
 * @param {object} recipe        – The full recipe object (title, ingredients, steps, etc.)
 * @param {number} currentStep   – Zero-based index of the step the user is on
 * @param {object[]} timers      – Active timers [{ label, remainingSeconds }]
 * @param {object[]} conversation – Recent conversation history [{ role, content }]
 * @returns {string} A system prompt string for the AI cooking assistant
 */
export function buildCookingPrompt(recipe, currentStep, timers, conversation) {
  const stepTotal = recipe.steps?.length ?? 0;
  const stepNumber = currentStep + 1;
  const currentInstruction = recipe.steps?.[currentStep] ?? null;

  const activeTimers = (timers ?? [])
    .map((t) => {
      const min = Math.floor(t.remainingSeconds / 60);
      const sec = t.remainingSeconds % 60;
      return `• ${t.label}: ${min} min ${sec} s kvar`;
    })
    .join('\n');

  const recentContext = (conversation ?? [])
    .slice(-4)
    .map((msg) => `${msg.role === 'user' ? 'Användaren' : 'Nisse'}: ${msg.content}`)
    .join('\n');

  return `Du är Nisse — en professionell kock-assistent som guidar användaren steg-för-steg genom matlagning via röst.

Regler:
- Svara med MAX 2–3 korta meningar. Användaren lyssnar, inte läser.
- Använd naturligt, vardagligt svenskt talspråk. Undvik skriftspråk och formella uttryck.
- Ge bara information om det aktuella steget om inte användaren frågar om annat.
- Om en timer håller på att gå ut, påminn om det först.
- Bekräfta kort när användaren är klar med ett steg innan du går vidare till nästa.
- Om användaren verkar osäker, ge ett kort uppmuntrande tips.

Recept: ${recipe.title ?? 'Okänt recept'}
Steg ${stepNumber} av ${stepTotal}${currentInstruction ? `: ${currentInstruction}` : ''}

${activeTimers ? `Aktiva timers:\n${activeTimers}` : 'Inga aktiva timers.'}

${recentContext ? `Senaste konversationen:\n${recentContext}` : ''}`.trim();
}
