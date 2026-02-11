// ============================================
// Home Page — Magic Search + Bento Grid Results
// ============================================

'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '../lib/store';
import { useRecipeSearch, useFavorites } from '../hooks/useRecipes';
import { HeroSearch } from '../components/HeroSearch';
import { RecipeGridCard } from '../components/RecipeGridCard';
import { RecipeDetail } from '../components/RecipeDetail';
import { PriceComparison } from '../components/PriceComparison';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { ShoppingList } from '../components/ShoppingList';
import { LoadingState } from '../components/LoadingState';
import { SourceBanner } from '../components/SourceBanner';
import { MOCK_RECIPES, filterRecipesByIngredients } from '../data/recipes';
import {
  ArrowLeft, Sparkles, ShieldCheck, Zap, Search,
  ChefHat, TrendingDown, LayoutGrid, Store,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const { results, loading, error, search, reset } = useRecipeSearch();
  const { toggleFavorite } = useFavorites();
  const [lastQuery, setLastQuery] = useState('');

  // Local mock search state
  const [searchTags, setSearchTags] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filtered mock recipes
  const filteredRecipes = useMemo(
    () => filterRecipesByIngredients(searchTags),
    [searchTags]
  );

  // Handle the magic search (local mock filtering)
  function handleMagicSearch(tags) {
    setSearchTags(tags);
    setSelectedRecipe(null);
  }

  // Handle full API search (for logged-in users)
  function handleApiSearch(query, householdSize) {
    if (!user) {
      window.location.href = '/login?redirect=/';
      return;
    }
    setLastQuery(query);
    search(query, householdSize);
  }

  // Reset everything
  function handleReset() {
    setSearchTags([]);
    setSelectedRecipe(null);
    reset();
  }

  // ── API Results view ──
  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl text-warm-800">
            Recept för &ldquo;{lastQuery}&rdquo;
          </h2>
          <button onClick={handleReset} className="btn-secondary text-sm !py-2">
            <ArrowLeft size={16} className="mr-1.5 inline" />
            Ny sökning
          </button>
        </div>

        {results.cached && (
          <div className="badge-green mb-4">Cachad sökning — inga extra API-anrop</div>
        )}

        <SourceBanner sources={results.sources} />

        <div className="space-y-5">
          {results.recipes.map((recipe, idx) => (
            <RecipeCard
              key={idx}
              recipe={recipe}
              onToggleFavorite={user ? toggleFavorite : null}
            />
          ))}
        </div>

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

  // ── Main view: Magic Search + Bento Grid ──
  return (
    <div className="min-h-screen">
      {/* Hero + Magic Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <HeroSearch onSearch={handleMagicSearch} loading={false} />
      </div>

      {/* Results section */}
      {searchTags.length > 0 && filteredRecipes.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 animate-fade-up">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <LayoutGrid size={18} className="text-brand-400" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-warm-800">
                  {filteredRecipes.length} recept hittade
                </h2>
                <p className="text-xs text-warm-400 mt-0.5">
                  Baserat på {searchTags.join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-warm-400 hover:text-brand-400 transition-colors font-medium"
            >
              Rensa
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeGridCard
                key={recipe.id}
                recipe={recipe}
                onClick={setSelectedRecipe}
              />
            ))}
          </div>

          {/* Prompt for full AI search */}
          <div className="mt-10 text-center">
            <div className="inline-flex flex-col items-center gap-3 bg-white rounded-2xl
                          border border-warm-200 px-8 py-6 shadow-soft">
              <Sparkles size={20} className="text-brand-400" />
              <p className="text-sm text-warm-600 max-w-sm">
                Vill du ha <strong>fler recept</strong> från hela webben, anpassade efter ditt hushåll?
              </p>
              <SearchBar onSearch={handleApiSearch} loading={loading} />
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {searchTags.length > 0 && filteredRecipes.length === 0 && (
        <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-warm-400" />
          </div>
          <h3 className="font-display text-xl text-warm-800 mb-2">Inga recept matchade</h3>
          <p className="text-sm text-warm-400 mb-6">
            Prova att lägga till fler ingredienser eller andra kombinationer.
          </p>
          <button
            onClick={handleReset}
            className="btn-secondary text-sm"
          >
            Prova igen
          </button>
        </div>
      )}

      {/* Features section — only when no search active */}
      {searchTags.length === 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={<Search size={20} />}
              title="Smart sökning"
              description="Skriv in vad du har — vi matchar recepten automatiskt."
              color="brand"
            />
            <FeatureCard
              icon={<TrendingDown size={20} />}
              title="Bästa priset"
              description="Jämför priser hos ICA, Willys, Coop och Lidl i realtid."
              color="forest"
            />
            <FeatureCard
              icon={<ChefHat size={20} />}
              title="Klassiska recept"
              description="Sveriges mest älskade rätter — från köttbullar till lax i ugn."
              color="gold"
            />
            <FeatureCard
              icon={<ShieldCheck size={20} />}
              title="Ingen reklam"
              description="Ren, enkel design. Bara du och maten."
              color="warm"
            />
          </div>

          {/* Popular recipes preview */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center">
                <Store size={18} className="text-gold-400" />
              </div>
              <h2 className="font-display text-2xl text-warm-800">Populära recept</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_RECIPES.slice(0, 3).map((recipe) => (
                <RecipeGridCard
                  key={recipe.id}
                  recipe={{ ...recipe, matchScore: 0 }}
                  onClick={setSelectedRecipe}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Login prompt */}
      {!user && searchTags.length === 0 && (
        <div className="max-w-lg mx-auto px-4 pb-20 text-center">
          <div className="bg-brand-50/40 border border-brand-100 rounded-2xl px-6 py-5">
            <p className="text-sm text-warm-600">
              <strong className="text-brand-400">Skapa ett gratis konto</strong> för att söka bland
              tusentals recept, spara favoriter och jämföra priser.{' '}
              <a href="/register" className="text-brand-400 font-semibold underline underline-offset-2">
                Registrera dig
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

// ── Feature Card ──
function FeatureCard({ icon, title, description, color }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-400',
    forest: 'bg-forest-50 text-forest-400',
    gold: 'bg-gold-50 text-gold-400',
    warm: 'bg-warm-100 text-warm-500',
  };

  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-5 hover:shadow-soft
                  transition-all duration-300 hover:-translate-y-0.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-warm-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-warm-400 leading-relaxed">{description}</p>
    </div>
  );
}
