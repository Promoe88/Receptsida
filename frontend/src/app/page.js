// ============================================
// Home Page — Native-feel hero search with context chips
// Platform-aware: Web (Hero + marketing) vs App (Compact)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isApp } from '../lib/platform';
import { useAuthStore } from '../lib/store';
import { useRecipeSearch, useFavorites, useSearchHistory } from '../hooks/useRecipes';
import { HeroSearch } from '../components/HeroSearch';
import { AppHome } from '../components/app/AppHome';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetail } from '../components/RecipeDetail';
import { ShoppingList } from '../components/ShoppingList';
import { LoadingState } from '../components/LoadingState';
import { SourceBanner } from '../components/SourceBanner';
import { NisseButton } from '../components/NisseButton';
import { PageTransition } from '../components/PageTransition';
import {
  ArrowLeft, Leaf, TrendingDown, Headphones, ChefHat,
  ShoppingBag, Mic,
} from 'lucide-react';
import Link from 'next/link';

const TICKER_ITEMS = [
  { text: 'Kycklingfilé 20% billigare på Willys just nu', tag: 'Erbjudande' },
  { text: 'Laxfilé till bästa pris på Coop denna vecka', tag: 'Veckans fynd' },
  { text: 'Säsongens bästa: Svensk sparris finns nu', tag: 'Säsong' },
  { text: 'Pasta & ris till kampanjpris hos ICA', tag: 'Kampanj' },
  { text: 'Ekologiska grönsaker 30% billigare på Lidl', tag: 'Eko-deal' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const { results, loading, error, search, reset } = useRecipeSearch();
  const { toggleFavorite } = useFavorites();
  const { history, loadHistory } = useSearchHistory();
  const [lastQuery, setLastQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (isApp && user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  function handleSearch(query, householdSize, preferences) {
    setLastQuery(query);
    search(query, householdSize, preferences);
  }

  function handleReset() {
    setSelectedRecipe(null);
    reset();
  }

  // ── Results view ──
  if (results) {
    return (
      <PageTransition>
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 ${isApp ? 'pt-4 pb-4 safe-top' : 'py-8'}`}>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className={`font-display text-warm-800 ${isApp ? 'text-xl' : 'text-display-sm'}`}>
              Recept för &ldquo;{lastQuery}&rdquo;
            </h2>
            <NisseButton variant="outline" size="sm" onClick={handleReset}>
              <ArrowLeft size={16} /> Ny sökning
            </NisseButton>
          </div>

          {results.cached && <div className="badge-sage mb-4">Cachad sökning</div>}
          <SourceBanner sources={results.sources} />

          {error && (
            <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-3 rounded-2xl text-sm mb-4">
              {error}
            </div>
          )}

          <div className={isApp ? 'space-y-4' : 'space-y-6'}>
            {results.recipes.map((recipe, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onToggleFavorite={user ? toggleFavorite : null}
                  onSelect={setSelectedRecipe}
                />
              </motion.div>
            ))}
          </div>

          {results.shopping_list?.length > 0 && (
            <div className="mt-8">
              <ShoppingList items={results.shopping_list} />
            </div>
          )}

          <AnimatePresence>
            {selectedRecipe && (
              <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    );
  }

  if (loading) return <LoadingState />;

  // ── App: compact native search ──
  if (isApp) {
    const recentSearches = history?.map((h) => ({ query: h.query })) || [];
    return <AppHome onSearch={handleSearch} loading={loading} recentSearches={recentSearches} />;
  }

  // ── Web: full marketing page ──
  return (
    <div className="min-h-screen">
      <section>
        <HeroSearch onSearch={handleSearch} loading={loading} />
      </section>

      {/* Market Insight Ticker */}
      <section className="py-4 bg-cream-200/60 border-y border-warm-200/50 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-8 whitespace-nowrap">
                <span className="badge-terra text-[10px] !py-0.5">{item.tag}</span>
                <span className="text-sm text-warm-600">{item.text}</span>
                <span className="text-warm-300">|</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 mt-8">
          <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-3 rounded-2xl text-sm text-center">
            {error}
          </div>
        </motion.div>
      )}

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-display-sm text-warm-800 mb-3">Från kylskåp till middagsbord</h2>
          <p className="text-warm-500 max-w-md mx-auto">Tre steg. Noll beslutströtthet.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <StepCard number="1" icon={<ChefHat size={22} />} title="Sök" text="Skriv vad du har hemma, en maträtt, eller din budget. AI hittar de bästa recepten åt dig." />
          <StepCard number="2" icon={<ShoppingBag size={22} />} title="Handla" text="Röststyrd inköpslista som guidar dig genom butiken, hylla för hylla. Handsfree." />
          <StepCard number="3" icon={<Mic size={22} />} title="Laga" text="Steg-för-steg med timer och AI-kock som svarar på dina frågor. Som en kock i örat." />
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream-200/40 py-16 border-y border-warm-200/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard icon={<Leaf size={20} className="text-sage-400" />} title="Hållbar matlagning" text="Minimera matsvinn genom att laga mat med vad du redan har." />
            <FeatureCard icon={<TrendingDown size={20} className="text-terra-400" />} title="Bästa priset" text="Se pris per portion och jämför ICA, Willys, Coop & Lidl." />
            <FeatureCard icon={<Headphones size={20} className="text-sage-400" />} title="Röststyrt" text="Handla och laga helt handsfree med röstkommandon." />
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16">
          <div className="max-w-lg mx-auto text-center px-4">
            <div className="card p-8">
              <div className="w-14 h-14 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ChefHat size={28} className="text-sage-400" />
              </div>
              <h3 className="font-display text-2xl text-warm-800 mb-2">Börja laga smartare</h3>
              <p className="text-warm-500 text-sm mb-6">
                Skapa ett gratis konto för att söka bland tusentals recept, spara favoriter och få röststyrd matlagningshjälp.
              </p>
              <Link href="/register" className="btn-primary inline-flex items-center gap-2">
                Skapa konto gratis
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card-elevated p-6"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-cream-200">{icon}</div>
      <h3 className="font-semibold text-warm-800 mb-1">{title}</h3>
      <p className="text-sm text-warm-500 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function StepCard({ number, icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card p-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-sage-400 text-white flex items-center justify-center mx-auto mb-4 shadow-sage-glow">
        {icon}
      </div>
      <span className="text-xs font-semibold text-sage-400 uppercase tracking-widest">Steg {number}</span>
      <h3 className="font-display text-xl text-warm-800 mt-1 mb-2">{title}</h3>
      <p className="text-sm text-warm-500 leading-relaxed">{text}</p>
    </motion.div>
  );
}
