// ============================================
// Recipe Utilities — Dynamic helpers (no mock data)
// All recipe data comes from the AI search API
// ============================================

// Aisle definitions for organizing shopping lists
const AISLE_MAP = {
  'Kött & Fisk': { icon: '🥩', order: 1 },
  'Mejeri': { icon: '🧈', order: 2 },
  'Frukt & Grönt': { icon: '🥬', order: 3 },
  'Torrvaror & Pasta': { icon: '🍝', order: 4 },
  'Konserver & Såser': { icon: '🥫', order: 5 },
  'Kryddor & Smaksättare': { icon: '🧂', order: 6 },
  'Oljor & Vinäger': { icon: '🫒', order: 7 },
  'Bröd': { icon: '🍞', order: 8 },
  'Frys': { icon: '🧊', order: 9 },
  'Övrigt': { icon: '📦', order: 99 },
};

// Group ingredients by aisle for shopping route
export function groupByAisle(ingredients) {
  const groups = {};
  for (const ing of ingredients) {
    const aisleName = ing.aisle || 'Övrigt';
    const aisle = AISLE_MAP[aisleName] || AISLE_MAP['Övrigt'];
    if (!groups[aisleName]) {
      groups[aisleName] = { name: aisleName, icon: aisle.icon, order: aisle.order, items: [] };
    }
    groups[aisleName].items.push(ing);
  }
  return Object.values(groups).sort((a, b) => a.order - b.order);
}

// Get step text regardless of format (string or object)
export function getStepText(step) {
  if (typeof step === 'string') return step;
  return step?.text || step?.content || '';
}

// Get step duration regardless of format
export function getStepDuration(step) {
  if (typeof step !== 'object') return null;
  return step?.duration_seconds || step?.duration || null;
}
