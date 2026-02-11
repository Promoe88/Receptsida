// ============================================
// Home Page — Search-first AI recipe platform
// No mock data: everything flows through AI search
// ============================================

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import { useRecipeSearch, useFavorites } from '../hooks/useRecipes';
import { HeroSearch } from '../components/HeroSearch';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetail } from '../components/RecipeDetail';
import { ShoppingList } from '../components/ShoppingList';
import { LoadingState } from '../components/LoadingState';
import { SourceBanner } from '../components/SourceBanner';
import {
  ArrowLeft, Zap, TrendingDown, ShieldCheck, ChefHat,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuthStore();
  const { results, loading, error, search, reset } = useRecipeSearch();
  const { toggleFavorite } = useFavorites();
  const [lastQuery, setLastQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  function handleSearch(query, householdSize, preferences) {
    if (!user) {
      window.location.href = '/login?redirect=/';
      return;
    }
    setLastQuery(query);
    search(query, householdSize, preferences);
  }

  function handleReset() {
    setSelectedRecipe(null);
    reset();
  }

  // Results view
  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl text-zinc-100">
            Recept för &ldquo;{lastQuery}&rdquo;
          </h2>
          <button onClick={handleReset} className="btn-surface text-sm !py-2">
            <ArrowLeft size={16} className="mr-1.5 inline" />
            Ny sökning
          </button>
        </div>

        {results.cached && (
          <div className="badge-emerald mb-4">Cachad sökning</div>
        )}

        <SourceBanner sources={results.sources} />

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {results.recipes.map((recipe, idx) => (
            <RecipeCard
              key={idx}
              recipe={recipe}
              onToggleFavorite={user ? toggleFavorite : null}
              onSelect={setSelectedRecipe}
            />
          ))}
        </div>

        {results.shopping_list?.length > 0 && (
          <div className="mt-6">
            <ShoppingList items={results.shopping_list} />
          </div>
        )}

        {/* Recipe detail modal */}
        <AnimatePresence>
          {selectedRecipe && (
            <RecipeDetail
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Loading view
  if (loading) return <LoadingState />;

  // Main search-first interface
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20">

        {/* Hero search — THE core product */}
        <section className="mb-16">
          <HeroSearch onSearch={handleSearch} loading={loading} />
        </section>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          </motion.div>
        )}

        {/* Features grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14 max-w-3xl mx-auto">
          <FeatureCard
            icon={<Zap size={18} />}
            title="Noll beslutströtthet"
            text="Säg vad du har, vi löser middagen med AI."
          />
          <FeatureCard
            icon={<TrendingDown size={18} />}
            title="Röststyrt"
            text="Handla och laga med röstguide. Handsfree i köket."
          />
          <FeatureCard
            icon={<ShieldCheck size={18} />}
            title="AI-kockassistent"
            text="Ställ frågor under matlagningen. Som en kock i örat."
          />
        </div>

        {/* How it works */}
        <section className="max-w-2xl mx-auto mb-14">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-9 h-9 rounded-xl bg-accent-400/10 flex items-center justify-center">
              <ChefHat size={18} className="text-accent-400" />
            </div>
            <h2 className="font-display text-xl text-zinc-100">Så funkar det</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <StepCard
              number="1"
              title="Sök"
              text="Skriv vad du har hemma, en maträtt, eller din budget. AI hittar recepten."
            />
            <StepCard
              number="2"
              title="Handla"
              text="Röststyrd inköpslista som guidar dig genom butiken, hylla för hylla."
            />
            <StepCard
              number="3"
              title="Laga"
              text="Steg-för-steg med timer och AI-kock som svarar på dina frågor live."
            />
          </div>
        </section>

        {/* Login prompt */}
        {!user && (
          <div className="max-w-lg mx-auto text-center">
            <div className="card-dark px-6 py-6">
              <p className="text-sm text-zinc-400">
                <strong className="text-accent-400">Skapa ett gratis konto</strong> för att söka bland
                tusentals recept, spara favoriter och få röststyrd matlagningshjälp.{' '}
                <Link href="/register" className="text-accent-400 font-semibold underline underline-offset-2">
                  Registrera dig
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="card-elevated p-5 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-accent-400/10 text-accent-400">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-100 text-sm mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{text}</p>
    </div>
  );
}

function StepCard({ number, title, text }) {
  return (
    <div className="card-dark p-5 text-center">
      <div className="w-10 h-10 rounded-full bg-accent-400 text-void flex items-center justify-center
                    font-bold text-lg mx-auto mb-3 shadow-glow-sm">
        {number}
      </div>
      <h3 className="font-semibold text-zinc-100 text-sm mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{text}</p>
    </div>
  );
}
