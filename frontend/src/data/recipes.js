// ============================================
// Recipe Database — Enhanced with aisles, price trends, verified flags
// ============================================

// Aisle mapping for Grocery Mode
export const AISLES = {
  protein: { name: 'Kött & Fisk', icon: '🥩', order: 1 },
  mejeri: { name: 'Mejeri', icon: '🧈', order: 2 },
  grönsak: { name: 'Frukt & Grönt', icon: '🥬', order: 3 },
  frukt: { name: 'Frukt & Grönt', icon: '🥬', order: 3 },
  ört: { name: 'Frukt & Grönt', icon: '🥬', order: 3 },
  kolhydrat: { name: 'Torrvaror & Pasta', icon: '🍝', order: 4 },
  torrvaror: { name: 'Torrvaror & Pasta', icon: '🍝', order: 4 },
  konserv: { name: 'Konserver & Såser', icon: '🥫', order: 5 },
  krydda: { name: 'Kryddor & Smaksättare', icon: '🧂', order: 6 },
  olja: { name: 'Oljor & Vinäger', icon: '🫒', order: 7 },
};

// Smart Fridge — all available ingredients users can toggle
export const FRIDGE_INGREDIENTS = [
  { id: 'kyckling', name: 'Kyckling', emoji: '🍗', category: 'protein' },
  { id: 'lax', name: 'Lax', emoji: '🐟', category: 'protein' },
  { id: 'blandfärs', name: 'Blandfärs', emoji: '🥩', category: 'protein' },
  { id: 'falukorv', name: 'Falukorv', emoji: '🌭', category: 'protein' },
  { id: 'bacon', name: 'Bacon', emoji: '🥓', category: 'protein' },
  { id: 'ägg', name: 'Ägg', emoji: '🥚', category: 'mejeri' },
  { id: 'grädde', name: 'Grädde', emoji: '🥛', category: 'mejeri' },
  { id: 'mjölk', name: 'Mjölk', emoji: '🥛', category: 'mejeri' },
  { id: 'smör', name: 'Smör', emoji: '🧈', category: 'mejeri' },
  { id: 'parmesan', name: 'Parmesan', emoji: '🧀', category: 'mejeri' },
  { id: 'crème fraiche', name: 'Crème fraiche', emoji: '🫙', category: 'mejeri' },
  { id: 'potatis', name: 'Potatis', emoji: '🥔', category: 'grönsak' },
  { id: 'lök', name: 'Lök', emoji: '🧅', category: 'grönsak' },
  { id: 'vitlök', name: 'Vitlök', emoji: '🧄', category: 'grönsak' },
  { id: 'paprika', name: 'Paprika', emoji: '🫑', category: 'grönsak' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'kolhydrat' },
  { id: 'ris', name: 'Ris', emoji: '🍚', category: 'kolhydrat' },
  { id: 'tomatpuré', name: 'Tomatpuré', emoji: '🥫', category: 'konserv' },
  { id: 'olivolja', name: 'Olivolja', emoji: '🫒', category: 'olja' },
  { id: 'dill', name: 'Dill', emoji: '🌿', category: 'ört' },
  { id: 'citron', name: 'Citron', emoji: '🍋', category: 'frukt' },
  { id: 'senap', name: 'Senap', emoji: '🟡', category: 'krydda' },
  { id: 'lingonsylt', name: 'Lingonsylt', emoji: '🫐', category: 'konserv' },
  { id: 'ströbröd', name: 'Ströbröd', emoji: '🍞', category: 'torrvaror' },
];

export const MOCK_RECIPES = [
  {
    id: 'korv-stroganoff',
    title: 'Korv Stroganoff',
    description: 'Klassisk svensk husmanskost med falukorv i en krämig tomatsås. Snabbt, billigt och älskat av hela familjen.',
    image: null,
    prepTime: 25,
    difficulty: 'Enkel',
    servings: 4,
    verified: true,
    rating: 4.7,
    ingredients: [
      { name: 'Falukorv', amount: '400 g', category: 'protein', aisle: 'protein' },
      { name: 'Lök', amount: '1 st', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Tomatpuré', amount: '2 msk', category: 'konserv', aisle: 'konserv' },
      { name: 'Grädde', amount: '2 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Mjölk', amount: '1 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Dijonsenap', amount: '1 msk', category: 'krydda', aisle: 'krydda' },
      { name: 'Ris', amount: '4 port', category: 'kolhydrat', aisle: 'kolhydrat' },
      { name: 'Smör', amount: '1 msk', category: 'mejeri', aisle: 'mejeri' },
    ],
    steps: [
      { text: 'Skär falukorven i strimlor.', duration: null },
      { text: 'Hacka löken och fräs i smör tills den mjuknar.', duration: 180 },
      { text: 'Lägg i korven och fräs ett par minuter.', duration: 120 },
      { text: 'Rör ner tomatpurén och låt fräsa en minut.', duration: 60 },
      { text: 'Häll i grädde och mjölk, rör om och låt sjuda 10 minuter.', duration: 600 },
      { text: 'Smaka av med senap, salt och peppar. Servera med ris.', duration: null },
    ],
    pricing: [
      { storeName: 'ICA', price: 78, trend: -5 },
      { storeName: 'Willys', price: 65, trend: -2 },
      { storeName: 'Coop', price: 82, trend: 3 },
      { storeName: 'Lidl', price: 59, trend: -8 },
    ],
    tags: ['falukorv', 'grädde', 'ris', 'lök', 'tomatpuré', 'mjölk', 'senap', 'smör'],
    priceTrends: [72, 70, 68, 65, 62, 59],
  },
  {
    id: 'lax-i-ugn',
    title: 'Lax i ugn med dillsås',
    description: 'Ugnsbakad lax med en klassisk svensk dillsås. Elegant men enkel — perfekt till vardags och fest.',
    image: null,
    prepTime: 30,
    difficulty: 'Enkel',
    servings: 4,
    verified: true,
    rating: 4.9,
    ingredients: [
      { name: 'Laxfilé', amount: '600 g', category: 'protein', aisle: 'protein' },
      { name: 'Citron', amount: '1 st', category: 'frukt', aisle: 'frukt' },
      { name: 'Dill', amount: '1 knippe', category: 'ört', aisle: 'ört' },
      { name: 'Crème fraiche', amount: '2 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Dijonsenap', amount: '1 tsk', category: 'krydda', aisle: 'krydda' },
      { name: 'Potatis', amount: '800 g', category: 'kolhydrat', aisle: 'grönsak' },
      { name: 'Olivolja', amount: '2 msk', category: 'olja', aisle: 'olja' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak', aisle: 'grönsak' },
    ],
    steps: [
      { text: 'Sätt ugnen på 200°C.', duration: null },
      { text: 'Lägg laxen på en plåt med bakplåtspapper. Ringla över olivolja, salta och peppra.', duration: null },
      { text: 'Skär citronen i skivor och lägg ovanpå laxen.', duration: null },
      { text: 'Baka i ugnen 15–18 minuter.', duration: 960 },
      { text: 'Rör ihop crème fraiche, hackad dill och senap till dillsåsen.', duration: null },
      { text: 'Koka potatisen. Servera laxen med dillsås och kokt potatis.', duration: 1200 },
    ],
    pricing: [
      { storeName: 'ICA', price: 149, trend: 2 },
      { storeName: 'Willys', price: 132, trend: -4 },
      { storeName: 'Coop', price: 155, trend: 5 },
      { storeName: 'Lidl', price: 125, trend: -12 },
    ],
    tags: ['lax', 'dill', 'potatis', 'citron', 'crème fraiche', 'senap', 'vitlök', 'olivolja'],
    priceTrends: [142, 138, 135, 130, 128, 125],
  },
  {
    id: 'kottbullar',
    title: 'Köttbullar med potatismos',
    description: 'Sveriges nationalrätt — hemlagade köttbullar med krämigt potatismos, brunsås och lingon.',
    image: null,
    prepTime: 45,
    difficulty: 'Medel',
    servings: 4,
    verified: true,
    rating: 4.8,
    ingredients: [
      { name: 'Blandfärs', amount: '500 g', category: 'protein', aisle: 'protein' },
      { name: 'Lök', amount: '1 st', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Ströbröd', amount: '3 msk', category: 'torrvaror', aisle: 'torrvaror' },
      { name: 'Ägg', amount: '1 st', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Mjölk', amount: '1 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Potatis', amount: '1 kg', category: 'kolhydrat', aisle: 'grönsak' },
      { name: 'Smör', amount: '50 g', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Grädde', amount: '2 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Lingonsylt', amount: '1 burk', category: 'konserv', aisle: 'konserv' },
    ],
    steps: [
      { text: 'Blötlägg ströbröd i mjölk.', duration: 300 },
      { text: 'Blanda färs, finriven lök, ägg och det blötlagda ströbrödet. Salta och peppra.', duration: null },
      { text: 'Rulla till jämna köttbullar, ca 3 cm i diameter.', duration: null },
      { text: 'Stek köttbullarna i smör i en stekpanna tills de är genomstekta.', duration: 600 },
      { text: 'Koka och mosa potatisen med smör och varm mjölk.', duration: 1200 },
      { text: 'Gör brunsås i stekpannan med grädde och sky. Servera med lingonsylt.', duration: 300 },
    ],
    pricing: [
      { storeName: 'ICA', price: 119, trend: 0 },
      { storeName: 'Willys', price: 105, trend: -3 },
      { storeName: 'Coop', price: 125, trend: 4 },
      { storeName: 'Lidl', price: 98, trend: -6 },
    ],
    tags: ['blandfärs', 'potatis', 'lök', 'ägg', 'grädde', 'mjölk', 'smör', 'ströbröd', 'lingonsylt'],
    priceTrends: [112, 108, 105, 102, 100, 98],
  },
  {
    id: 'pasta-carbonara',
    title: 'Pasta Carbonara',
    description: 'Den svenska favoriten — krämig pasta med bacon, ägg och parmesan. Klar på 20 minuter.',
    image: null,
    prepTime: 20,
    difficulty: 'Enkel',
    servings: 4,
    verified: false,
    rating: 4.5,
    ingredients: [
      { name: 'Spaghetti', amount: '400 g', category: 'kolhydrat', aisle: 'kolhydrat' },
      { name: 'Bacon', amount: '200 g', category: 'protein', aisle: 'protein' },
      { name: 'Ägg', amount: '3 st', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Parmesan', amount: '100 g', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Svartpeppar', amount: 'rikligt', category: 'krydda', aisle: 'krydda' },
    ],
    steps: [
      { text: 'Koka pastan enligt förpackningen.', duration: 600 },
      { text: 'Stek baconet krispigt i en stekpanna.', duration: 300 },
      { text: 'Vispa ihop ägg, riven parmesan och svartpeppar.', duration: null },
      { text: 'Häll av pastan men spara lite kokvattnet.', duration: null },
      { text: 'Blanda den varma pastan med baconet och äggblandningen. Rör snabbt.', duration: null },
      { text: 'Späd med lite kokvatten för krämig konsistens. Servera direkt med extra parmesan.', duration: null },
    ],
    pricing: [
      { storeName: 'ICA', price: 95, trend: 1 },
      { storeName: 'Willys', price: 82, trend: -5 },
      { storeName: 'Coop', price: 99, trend: 2 },
      { storeName: 'Lidl', price: 75, trend: -10 },
    ],
    tags: ['pasta', 'spaghetti', 'bacon', 'ägg', 'parmesan', 'vitlök'],
    priceTrends: [88, 85, 82, 79, 77, 75],
  },
  {
    id: 'kycklinggryta',
    title: 'Krämig kycklinggryta',
    description: 'Lättlagad kycklinggryta med paprika och grädde. En vardagsfavorit som hela familjen älskar.',
    image: null,
    prepTime: 35,
    difficulty: 'Enkel',
    servings: 4,
    verified: true,
    rating: 4.6,
    ingredients: [
      { name: 'Kycklingfilé', amount: '500 g', category: 'protein', aisle: 'protein' },
      { name: 'Paprika', amount: '2 st', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Lök', amount: '1 st', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak', aisle: 'grönsak' },
      { name: 'Grädde', amount: '3 dl', category: 'mejeri', aisle: 'mejeri' },
      { name: 'Kycklingbuljong', amount: '1 tärning', category: 'krydda', aisle: 'krydda' },
      { name: 'Paprikapulver', amount: '1 msk', category: 'krydda', aisle: 'krydda' },
      { name: 'Ris', amount: '4 port', category: 'kolhydrat', aisle: 'kolhydrat' },
      { name: 'Olivolja', amount: '1 msk', category: 'olja', aisle: 'olja' },
    ],
    steps: [
      { text: 'Skär kycklingen i bitar och krydda med salt, peppar och paprikapulver.', duration: null },
      { text: 'Stek kycklingen i olivolja tills den har fin färg. Lägg åt sidan.', duration: 300 },
      { text: 'Fräs lök, vitlök och skivad paprika i samma panna.', duration: 180 },
      { text: 'Lägg tillbaka kycklingen, häll i grädde och buljong.', duration: null },
      { text: 'Låt sjuda på medelvärme i 15 minuter.', duration: 900 },
      { text: 'Servera med nykokt ris.', duration: null },
    ],
    pricing: [
      { storeName: 'ICA', price: 112, trend: -1 },
      { storeName: 'Willys', price: 95, trend: -7 },
      { storeName: 'Coop', price: 118, trend: 3 },
      { storeName: 'Lidl', price: 89, trend: -11 },
    ],
    tags: ['kyckling', 'paprika', 'grädde', 'ris', 'lök', 'vitlök', 'olivolja'],
    priceTrends: [105, 100, 96, 93, 91, 89],
  },
];

// ── Helper: Calculate match score ──
export function calculateMatchScore(recipe, userIngredients) {
  if (!userIngredients || userIngredients.length === 0) return 0;
  const normalizedUser = userIngredients.map((i) => i.toLowerCase().trim());
  const matchedCount = recipe.tags.filter((tag) =>
    normalizedUser.some((ui) => tag.includes(ui) || ui.includes(tag))
  ).length;
  return Math.round((matchedCount / recipe.tags.length) * 100);
}

// ── Helper: Get cheapest store ──
export function getCheapestStore(pricing) {
  if (!pricing || pricing.length === 0) return null;
  return pricing.reduce((min, store) => (store.price < min.price ? store : min));
}

// ── Helper: Filter recipes by ingredients ──
export function filterRecipesByIngredients(ingredients) {
  if (!ingredients || ingredients.length === 0) return [];
  return MOCK_RECIPES
    .map((recipe) => ({
      ...recipe,
      matchScore: calculateMatchScore(recipe, ingredients),
      cheapestStore: getCheapestStore(recipe.pricing),
    }))
    .filter((recipe) => recipe.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

// ── Helper: Get daily recommendation ──
export function getDailyRecommendation() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return MOCK_RECIPES[dayOfYear % MOCK_RECIPES.length];
}

// ── Helper: Group ingredients by aisle ──
export function groupByAisle(ingredients) {
  const groups = {};
  for (const ing of ingredients) {
    const aisleKey = ing.aisle || ing.category || 'övrigt';
    const aisle = AISLES[aisleKey] || { name: 'Övrigt', icon: '📦', order: 99 };
    if (!groups[aisle.name]) {
      groups[aisle.name] = { ...aisle, items: [] };
    }
    groups[aisle.name].items.push(ing);
  }
  return Object.values(groups).sort((a, b) => a.order - b.order);
}

// ── Helper: Find complete meals from owned ingredients ──
export function findCompleteMeals(ownedIngredientIds) {
  if (!ownedIngredientIds || ownedIngredientIds.length === 0) return [];
  return MOCK_RECIPES
    .map((recipe) => {
      const score = calculateMatchScore(recipe, ownedIngredientIds);
      return { ...recipe, matchScore: score, cheapestStore: getCheapestStore(recipe.pricing) };
    })
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
