// ============================================
// Seed Script — Swedish ingredient lexicon
// Run: npm run seed
// ============================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lexicon = [
  // ── Protein ──
  { word: 'kyckling', canonical: 'kyckling', category: 'protein', emoji: '🍗', synonyms: ['kycklingfilé', 'kycklingbröst', 'kycklinglår', 'chicken', 'broiler'] },
  { word: 'nötfärs', canonical: 'nötfärs', category: 'protein', emoji: '🥩', synonyms: ['köttfärs', 'färs', 'mince', 'blandfärs'] },
  { word: 'lax', canonical: 'lax', category: 'protein', emoji: '🐟', synonyms: ['laxfilé', 'salmon', 'vildlax', 'odlad lax'] },
  { word: 'fläskfilé', canonical: 'fläskfilé', category: 'protein', emoji: '🥓', synonyms: ['fläsk', 'griskött', 'pork'] },
  { word: 'räkor', canonical: 'räkor', category: 'protein', emoji: '🦐', synonyms: ['räka', 'shrimp', 'handskalade räkor', 'jätteräkor'] },
  { word: 'torsk', canonical: 'torsk', category: 'protein', emoji: '🐟', synonyms: ['torskfilé', 'cod'] },
  { word: 'bacon', canonical: 'bacon', category: 'protein', emoji: '🥓', synonyms: ['sidfläsk', 'rökt fläsk'] },
  { word: 'korv', canonical: 'korv', category: 'protein', emoji: '🌭', synonyms: ['falukorv', 'prinskorv', 'bratwurst', 'chorizo'] },
  { word: 'tofu', canonical: 'tofu', category: 'protein', emoji: '🫘', synonyms: ['bönkurd', 'silkestofu'] },
  { word: 'ägg', canonical: 'ägg', category: 'protein', emoji: '🥚', synonyms: ['egg', 'hönsägg', 'frigående ägg'] },
  { word: 'kassler', canonical: 'kassler', category: 'protein', emoji: '🥩', synonyms: ['rökt kassler'] },
  { word: 'kött', canonical: 'kött', category: 'protein', emoji: '🥩', synonyms: ['biff', 'entrecote', 'ryggbiff', 'oxfilé', 'beef'] },

  // ── Kolhydrater ──
  { word: 'pasta', canonical: 'pasta', category: 'kolhydrat', emoji: '🍝', synonyms: ['spaghetti', 'penne', 'fusilli', 'tagliatelle', 'makaroner', 'farfalle'] },
  { word: 'ris', canonical: 'ris', category: 'kolhydrat', emoji: '🍚', synonyms: ['jasminris', 'basmatiris', 'fullkornsris', 'rice', 'risoni'] },
  { word: 'potatis', canonical: 'potatis', category: 'kolhydrat', emoji: '🥔', synonyms: ['potato', 'potatismos', 'kokt potatis', 'stekt potatis', 'pommes'] },
  { word: 'bröd', canonical: 'bröd', category: 'kolhydrat', emoji: '🍞', synonyms: ['bread', 'toast', 'baguette', 'knäckebröd', 'pitabröd'] },
  { word: 'nudlar', canonical: 'nudlar', category: 'kolhydrat', emoji: '🍜', synonyms: ['noodles', 'äggnudlar', 'risnudlar', 'glasnudlar', 'udon'] },
  { word: 'couscous', canonical: 'couscous', category: 'kolhydrat', emoji: '🫘', synonyms: ['cous cous'] },
  { word: 'bulgur', canonical: 'bulgur', category: 'kolhydrat', emoji: '🌾', synonyms: [] },
  { word: 'tortilla', canonical: 'tortilla', category: 'kolhydrat', emoji: '🌮', synonyms: ['tortillabröd', 'wraps'] },

  // ── Grönsaker ──
  { word: 'tomat', canonical: 'tomat', category: 'grönsak', emoji: '🍅', synonyms: ['tomater', 'cocktailtomat', 'körsbärstomat', 'krossade tomater'] },
  { word: 'lök', canonical: 'lök', category: 'grönsak', emoji: '🧅', synonyms: ['gul lök', 'rödlök', 'onion', 'silverlök'] },
  { word: 'vitlök', canonical: 'vitlök', category: 'grönsak', emoji: '🧄', synonyms: ['garlic', 'vitlöksklyfta'] },
  { word: 'paprika', canonical: 'paprika', category: 'grönsak', emoji: '🫑', synonyms: ['röd paprika', 'grön paprika', 'gul paprika', 'pepper'] },
  { word: 'morot', canonical: 'morot', category: 'grönsak', emoji: '🥕', synonyms: ['morötter', 'carrot'] },
  { word: 'broccoli', canonical: 'broccoli', category: 'grönsak', emoji: '🥦', synonyms: ['broccolibuketter'] },
  { word: 'spenat', canonical: 'spenat', category: 'grönsak', emoji: '🥬', synonyms: ['babyspenat', 'bladspenat', 'fryst spenat', 'spinach'] },
  { word: 'gurka', canonical: 'gurka', category: 'grönsak', emoji: '🥒', synonyms: ['slanggurka', 'cucumber'] },
  { word: 'sallad', canonical: 'sallad', category: 'grönsak', emoji: '🥬', synonyms: ['isbergssallad', 'romansallad', 'ruccola', 'salladsblad'] },
  { word: 'zucchini', canonical: 'zucchini', category: 'grönsak', emoji: '🥒', synonyms: ['squash'] },
  { word: 'champinjoner', canonical: 'champinjoner', category: 'grönsak', emoji: '🍄', synonyms: ['svamp', 'mushroom', 'portabello', 'kantareller', 'skivade champinjoner'] },
  { word: 'avokado', canonical: 'avokado', category: 'grönsak', emoji: '🥑', synonyms: ['avocado'] },
  { word: 'majs', canonical: 'majs', category: 'grönsak', emoji: '🌽', synonyms: ['corn', 'majskorn', 'burkmajs'] },
  { word: 'ärtor', canonical: 'ärtor', category: 'grönsak', emoji: '🫛', synonyms: ['gröna ärtor', 'frysta ärtor', 'sockerärtor'] },
  { word: 'bönor', canonical: 'bönor', category: 'grönsak', emoji: '🫘', synonyms: ['kidneybönor', 'svarta bönor', 'vita bönor', 'gröna bönor'] },
  { word: 'selleri', canonical: 'selleri', category: 'grönsak', emoji: '🥬', synonyms: ['stjälkselleri', 'rotselleri'] },
  { word: 'blomkål', canonical: 'blomkål', category: 'grönsak', emoji: '🥦', synonyms: ['cauliflower'] },
  { word: 'sötpotatis', canonical: 'sötpotatis', category: 'grönsak', emoji: '🍠', synonyms: ['sweet potato'] },

  // ── Mejeri ──
  { word: 'mjölk', canonical: 'mjölk', category: 'mejeri', emoji: '🥛', synonyms: ['milk', 'mellanmjölk', 'lättmjölk', 'helmjölk'] },
  { word: 'grädde', canonical: 'grädde', category: 'mejeri', emoji: '🥛', synonyms: ['vispgrädde', 'matlagningsgrädde', 'cream', 'crème fraiche'] },
  { word: 'smör', canonical: 'smör', category: 'mejeri', emoji: '🧈', synonyms: ['butter', 'margarin', 'bregott'] },
  { word: 'ost', canonical: 'ost', category: 'mejeri', emoji: '🧀', synonyms: ['riven ost', 'cheddar', 'mozzarella', 'parmesan', 'fetaost', 'cheese', 'cream cheese'] },
  { word: 'yoghurt', canonical: 'yoghurt', category: 'mejeri', emoji: '🥛', synonyms: ['turkisk yoghurt', 'naturell yoghurt', 'kvarg'] },
  { word: 'créme fraiche', canonical: 'créme fraiche', category: 'mejeri', emoji: '🥛', synonyms: ['creme fraiche', 'gräddfil'] },

  // ── Kryddor & Smaksättare ──
  { word: 'salt', canonical: 'salt', category: 'krydda', emoji: '🧂', synonyms: ['havssalt', 'flingsalt'] },
  { word: 'peppar', canonical: 'peppar', category: 'krydda', emoji: '🌶️', synonyms: ['svartpeppar', 'vitpeppar', 'black pepper'] },
  { word: 'olivolja', canonical: 'olivolja', category: 'krydda', emoji: '🫒', synonyms: ['olive oil', 'olja', 'matolja', 'rapsolja'] },
  { word: 'soja', canonical: 'soja', category: 'krydda', emoji: '🥢', synonyms: ['sojasås', 'soy sauce'] },
  { word: 'curry', canonical: 'curry', category: 'krydda', emoji: '🍛', synonyms: ['currypulver', 'currypasta', 'gul curry', 'röd curry'] },
  { word: 'chili', canonical: 'chili', category: 'krydda', emoji: '🌶️', synonyms: ['chiliflingor', 'chilipulver', 'chilisås', 'sriracha', 'sambal oelek'] },
  { word: 'basilika', canonical: 'basilika', category: 'krydda', emoji: '🌿', synonyms: ['basil', 'färsk basilika'] },
  { word: 'oregano', canonical: 'oregano', category: 'krydda', emoji: '🌿', synonyms: [] },
  { word: 'timjan', canonical: 'timjan', category: 'krydda', emoji: '🌿', synonyms: ['thyme'] },
  { word: 'rosmarin', canonical: 'rosmarin', category: 'krydda', emoji: '🌿', synonyms: ['rosemary'] },
  { word: 'spiskummin', canonical: 'spiskummin', category: 'krydda', emoji: '🫙', synonyms: ['kummin', 'cumin'] },
  { word: 'paprikapulver', canonical: 'paprikapulver', category: 'krydda', emoji: '🫙', synonyms: ['rökt paprika', 'paprika powder'] },
  { word: 'ingefära', canonical: 'ingefära', category: 'krydda', emoji: '🫚', synonyms: ['ginger', 'färsk ingefära', 'ingefärapulver'] },
  { word: 'kanel', canonical: 'kanel', category: 'krydda', emoji: '🫙', synonyms: ['cinnamon'] },
  { word: 'citron', canonical: 'citron', category: 'krydda', emoji: '🍋', synonyms: ['citronsaft', 'citronjuice', 'lemon'] },
  { word: 'lime', canonical: 'lime', category: 'krydda', emoji: '🍋', synonyms: ['limesaft', 'limejuice'] },
  { word: 'honung', canonical: 'honung', category: 'krydda', emoji: '🍯', synonyms: ['honey'] },
  { word: 'senap', canonical: 'senap', category: 'krydda', emoji: '🫙', synonyms: ['dijonsenap', 'grov senap', 'mustard'] },
  { word: 'ketchup', canonical: 'ketchup', category: 'krydda', emoji: '🫙', synonyms: [] },
  { word: 'kokosmjölk', canonical: 'kokosmjölk', category: 'krydda', emoji: '🥥', synonyms: ['coconut milk', 'kokosgrädde'] },
  { word: 'buljongtärning', canonical: 'buljongtärning', category: 'krydda', emoji: '🫙', synonyms: ['buljong', 'fond', 'kycklingbuljong', 'grönsaksbuljong'] },

  // ── Övrigt ──
  { word: 'mjöl', canonical: 'mjöl', category: 'övrigt', emoji: '🌾', synonyms: ['vetemjöl', 'flour'] },
  { word: 'socker', canonical: 'socker', category: 'övrigt', emoji: '🫙', synonyms: ['strösocker', 'sugar'] },
  { word: 'vin', canonical: 'vin', category: 'övrigt', emoji: '🍷', synonyms: ['vitt vin', 'rött vin', 'matlagningsvin'] },
  { word: 'linser', canonical: 'linser', category: 'övrigt', emoji: '🫘', synonyms: ['röda linser', 'gröna linser', 'lentils'] },
  { word: 'kikärtor', canonical: 'kikärtor', category: 'övrigt', emoji: '🫘', synonyms: ['chickpeas'] },
  { word: 'cashewnötter', canonical: 'cashewnötter', category: 'övrigt', emoji: '🥜', synonyms: ['cashew', 'nötter'] },
  { word: 'pinjekärnor', canonical: 'pinjekärnor', category: 'övrigt', emoji: '🥜', synonyms: ['pine nuts'] },
];

async function seed() {
  console.log('🌱 Seeding lexicon...');

  // Clear existing
  await prisma.lexiconEntry.deleteMany();

  // Insert all entries
  for (const entry of lexicon) {
    await prisma.lexiconEntry.create({ data: entry });
  }

  console.log(`✅ Seeded ${lexicon.length} lexicon entries`);

  // Log categories
  const categories = {};
  for (const entry of lexicon) {
    categories[entry.category] = (categories[entry.category] || 0) + 1;
  }
  console.log('📊 Categories:', categories);

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
