// ============================================
// Home Page — Search & Results
// ============================================

'use client';

import { useState } from 'react';
import { useAuthStore } from '../lib/store';
import { useRecipeSearch, useFavorites } from '../hooks/useRecipes';
import { SearchBar } from '../components/SearchBar';
import { RecipeCard } from '../components/RecipeCard';
import { ShoppingList } from '../components/ShoppingList';
import { LoadingState } from '../components/LoadingState';
import { SourceBanner } from '../components/SourceBanner';
import { ArrowLeft, Sparkles, Shield, Zap, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuthStore();
  const { results, loading, error, search, reset } = useRecipeSearch();
  const { toggleFavorite } = useFavorites();
  const [lastQuery, setLastQuery] = useState('');

  function handleSearch(query, householdSize) {
    if (!user) {
      // Redirect to login
      window.location.href = '/login?redirect=/';
      return;
    }
    setLastQuery(query);
    search(query, householdSize);
  }

  // ── Results view ──
  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl text-warm-800">
            Recept för &ldquo;{lastQuery}&rdquo;
          </h2>
          <button onClick={reset} className="btn-secondary text-sm !py-2">
            <ArrowLeft size={16} className="mr-1.5 inline" />
            Ny sökning
          </button>
        </div>

        {/* Cached indicator */}
        {results.cached && (
          <div className="badge-green mb-4">
            ⚡ Cachad sökning — inga extra API-anrop
          </div>
        )}

        <SourceBanner sources={results.sources} />

        {/* Recipe cards */}
        <div className="space-y-5">
          {results.recipes.map((recipe, idx) => (
            <RecipeCard
              key={idx}
              recipe={recipe}
              onToggleFavorite={user ? toggleFavorite : null}
            />
          ))}
        </div>

        {/* Shopping list */}
        {results.shopping_list?.length > 0 && (
          <div className="mt-6">
            <ShoppingList items={results.shopping_list} />
          </div>
        )}
      </div>
    );
  }

  // ── Loading view ──
  if (loading) {
    return <LoadingState />;
  }

  // ── Search view (default) ──
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center pt-12 sm:pt-20 pb-8 animate-fade-up">
        <div className="badge-green mb-5">
          <Sparkles size={14} />
          AI + webbsökning — riktiga recept
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-warm-800 leading-tight mb-4">
          Vad har du{' '}
          <em className="text-brand-400 italic">i kylen?</em>
        </h1>

        <p className="text-warm-500 text-lg max-w-lg mx-auto leading-relaxed font-light mb-10">
          Skriv in dina ingredienser — vi söker bland riktiga recept på nätet
          och anpassar dem efter dig.
        </p>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-5 max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700
                        px-5 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Login prompt */}
        {!user && (
          <div className="mt-8 max-w-2xl mx-auto bg-brand-50/50 border border-brand-100 rounded-xl px-6 py-4">
            <p className="text-sm text-warm-600">
              <strong className="text-brand-400">Skapa ett gratis konto</strong> för att söka recept,
              spara favoriter och se din historik.{' '}
              <Link href="/register" className="text-brand-400 font-semibold underline">
                Registrera dig här
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-5 py-16 max-w-3xl mx-auto">
        <FeatureCard
          icon={<Search size={24} />}
          title="Riktiga recept"
          description="AI:n söker på ICA, Coop, Köket.se och fler sajter efter testade recept som matchar dina ingredienser."
        />
        <FeatureCard
          icon={<Zap size={24} />}
          title="Snabbt & enkelt"
          description="Anpassade portioner, inköpslista och tydliga steg — oavsett om du är singel eller storfamilj."
        />
        <FeatureCard
          icon={<Shield size={24} />}
          title="Spara & kom ihåg"
          description="Favoritmarkera recept, se din sökhistorik och bygg upp ditt personliga receptbibliotek."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center px-4 py-6">
      <div className="w-12 h-12 bg-brand-50 text-brand-400 rounded-xl flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-warm-800 mb-1.5">{title}</h3>
      <p className="text-sm text-warm-500 leading-relaxed">{description}</p>
    </div>
  );
}
