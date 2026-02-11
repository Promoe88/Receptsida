// ============================================
// Mock Recipe Database — 5 Classic Swedish Recipes
// with realistic store pricing (ICA, Willys, Coop, Lidl)
// ============================================

export const MOCK_RECIPES = [
  {
    id: 'korv-stroganoff',
    title: 'Korv Stroganoff',
    description: 'Klassisk svensk husmanskost med falukorv i en krämig tomatsås. Snabbt, billigt och älskat av hela familjen.',
    image: null,
    prepTime: 25,
    difficulty: 'Enkel',
    servings: 4,
    ingredients: [
      { name: 'Falukorv', amount: '400 g', category: 'protein' },
      { name: 'Lök', amount: '1 st', category: 'grönsak' },
      { name: 'Tomatpuré', amount: '2 msk', category: 'konserv' },
      { name: 'Grädde', amount: '2 dl', category: 'mejeri' },
      { name: 'Mjölk', amount: '1 dl', category: 'mejeri' },
      { name: 'Dijonsenap', amount: '1 msk', category: 'krydda' },
      { name: 'Ris', amount: '4 port', category: 'kolhydrat' },
      { name: 'Smör', amount: '1 msk', category: 'mejeri' },
    ],
    steps: [
      'Skär falukorven i strimlor.',
      'Hacka löken och fräs i smör tills den mjuknar.',
      'Lägg i korven och fräs ett par minuter.',
      'Rör ner tomatpurén och låt fräsa en minut.',
      'Häll i grädde och mjölk, rör om och låt sjuda 10 minuter.',
      'Smaka av med senap, salt och peppar. Servera med ris.',
    ],
    pricing: [
      { storeName: 'ICA', price: 78 },
      { storeName: 'Willys', price: 65 },
      { storeName: 'Coop', price: 82 },
      { storeName: 'Lidl', price: 59 },
    ],
    tags: ['falukorv', 'grädde', 'ris', 'lök', 'tomatpuré', 'mjölk', 'senap', 'smör'],
  },
  {
    id: 'lax-i-ugn',
    title: 'Lax i ugn med dillsås',
    description: 'Ugnsbakad lax med en klassisk svensk dillsås. Elegant men enkel — perfekt till vardags och fest.',
    image: null,
    prepTime: 30,
    difficulty: 'Enkel',
    servings: 4,
    ingredients: [
      { name: 'Laxfilé', amount: '600 g', category: 'protein' },
      { name: 'Citron', amount: '1 st', category: 'frukt' },
      { name: 'Dill', amount: '1 knippe', category: 'ört' },
      { name: 'Crème fraiche', amount: '2 dl', category: 'mejeri' },
      { name: 'Dijonsenap', amount: '1 tsk', category: 'krydda' },
      { name: 'Potatis', amount: '800 g', category: 'kolhydrat' },
      { name: 'Olivolja', amount: '2 msk', category: 'olja' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak' },
    ],
    steps: [
      'Sätt ugnen på 200°C.',
      'Lägg laxen på en plåt med bakplåtspapper. Ringla över olivolja, salta och peppra.',
      'Skär citronen i skivor och lägg ovanpå laxen.',
      'Baka i ugnen 15–18 minuter.',
      'Rör ihop crème fraiche, hackad dill och senap till dillsåsen.',
      'Koka potatisen. Servera laxen med dillsås och kokt potatis.',
    ],
    pricing: [
      { storeName: 'ICA', price: 149 },
      { storeName: 'Willys', price: 132 },
      { storeName: 'Coop', price: 155 },
      { storeName: 'Lidl', price: 125 },
    ],
    tags: ['lax', 'dill', 'potatis', 'citron', 'crème fraiche', 'senap', 'vitlök', 'olivolja'],
  },
  {
    id: 'kottbullar',
    title: 'Köttbullar med potatismos',
    description: 'Sveriges nationalrätt — hemlagade köttbullar med krämigt potatismos, brunsås och lingon.',
    image: null,
    prepTime: 45,
    difficulty: 'Medel',
    servings: 4,
    ingredients: [
      { name: 'Blandfärs', amount: '500 g', category: 'protein' },
      { name: 'Lök', amount: '1 st', category: 'grönsak' },
      { name: 'Ströbröd', amount: '3 msk', category: 'torrvaror' },
      { name: 'Ägg', amount: '1 st', category: 'mejeri' },
      { name: 'Mjölk', amount: '1 dl', category: 'mejeri' },
      { name: 'Potatis', amount: '1 kg', category: 'kolhydrat' },
      { name: 'Smör', amount: '50 g', category: 'mejeri' },
      { name: 'Grädde', amount: '2 dl', category: 'mejeri' },
      { name: 'Lingonsylt', amount: '1 burk', category: 'konserv' },
    ],
    steps: [
      'Blötlägg ströbröd i mjölk.',
      'Blanda färs, finriven lök, ägg och det blötlagda ströbrödet. Salta och peppra.',
      'Rulla till jämna köttbullar, ca 3 cm i diameter.',
      'Stek köttbullarna i smör i en stekpanna tills de är genomstekta.',
      'Koka och mosa potatisen med smör och varm mjölk.',
      'Gör brunsås i stekpannan med grädde och sky. Servera med lingonsylt.',
    ],
    pricing: [
      { storeName: 'ICA', price: 119 },
      { storeName: 'Willys', price: 105 },
      { storeName: 'Coop', price: 125 },
      { storeName: 'Lidl', price: 98 },
    ],
    tags: ['blandfärs', 'potatis', 'lök', 'ägg', 'grädde', 'mjölk', 'smör', 'ströbröd', 'lingonsylt'],
  },
  {
    id: 'pasta-carbonara',
    title: 'Pasta Carbonara',
    description: 'Den svenska favoriten — krämig pasta med bacon, ägg och parmesan. Klar på 20 minuter.',
    image: null,
    prepTime: 20,
    difficulty: 'Enkel',
    servings: 4,
    ingredients: [
      { name: 'Spaghetti', amount: '400 g', category: 'kolhydrat' },
      { name: 'Bacon', amount: '200 g', category: 'protein' },
      { name: 'Ägg', amount: '3 st', category: 'mejeri' },
      { name: 'Parmesan', amount: '100 g', category: 'mejeri' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak' },
      { name: 'Svartpeppar', amount: 'rikligt', category: 'krydda' },
    ],
    steps: [
      'Koka pastan enligt förpackningen.',
      'Stek baconet krispigt i en stekpanna.',
      'Vispa ihop ägg, riven parmesan och svartpeppar.',
      'Häll av pastan men spara lite kokvattnet.',
      'Blanda den varma pastan med baconet och äggblandningen. Rör snabbt.',
      'Späd med lite kokvatten för krämig konsistens. Servera direkt med extra parmesan.',
    ],
    pricing: [
      { storeName: 'ICA', price: 95 },
      { storeName: 'Willys', price: 82 },
      { storeName: 'Coop', price: 99 },
      { storeName: 'Lidl', price: 75 },
    ],
    tags: ['pasta', 'spaghetti', 'bacon', 'ägg', 'parmesan', 'vitlök'],
  },
  {
    id: 'kycklinggryta',
    title: 'Krämig kycklinggryta',
    description: 'Lättlagad kycklinggryta med paprika och grädde. En vardagsfavorit som hela familjen älskar.',
    image: null,
    prepTime: 35,
    difficulty: 'Enkel',
    servings: 4,
    ingredients: [
      { name: 'Kycklingfilé', amount: '500 g', category: 'protein' },
      { name: 'Paprika', amount: '2 st', category: 'grönsak' },
      { name: 'Lök', amount: '1 st', category: 'grönsak' },
      { name: 'Vitlök', amount: '2 klyftor', category: 'grönsak' },
      { name: 'Grädde', amount: '3 dl', category: 'mejeri' },
      { name: 'Kycklingbuljong', amount: '1 tärning', category: 'krydda' },
      { name: 'Paprikapulver', amount: '1 msk', category: 'krydda' },
      { name: 'Ris', amount: '4 port', category: 'kolhydrat' },
      { name: 'Olivolja', amount: '1 msk', category: 'olja' },
    ],
    steps: [
      'Skär kycklingen i bitar och krydda med salt, peppar och paprikapulver.',
      'Stek kycklingen i olivolja tills den har fin färg. Lägg åt sidan.',
      'Fräs lök, vitlök och skivad paprika i samma panna.',
      'Lägg tillbaka kycklingen, häll i grädde och buljong.',
      'Låt sjuda på medelvärme i 15 minuter.',
      'Servera med nykokt ris.',
    ],
    pricing: [
      { storeName: 'ICA', price: 112 },
      { storeName: 'Willys', price: 95 },
      { storeName: 'Coop', price: 118 },
      { storeName: 'Lidl', price: 89 },
    ],
    tags: ['kyckling', 'paprika', 'grädde', 'ris', 'lök', 'vitlök', 'olivolja'],
  },
];

// ── Helper: Calculate match score ──
export function calculateMatchScore(recipe, userIngredients) {
  if (!userIngredients || userIngredients.length === 0) return 0;

  const normalizedUser = userIngredients.map((i) =>
    i.toLowerCase().trim()
  );

  const matchedCount = recipe.tags.filter((tag) =>
    normalizedUser.some(
      (ui) => tag.includes(ui) || ui.includes(tag)
    )
  ).length;

  return Math.round((matchedCount / recipe.tags.length) * 100);
}

// ── Helper: Get cheapest store ──
export function getCheapestStore(pricing) {
  if (!pricing || pricing.length === 0) return null;
  return pricing.reduce((min, store) =>
    store.price < min.price ? store : min
  );
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
