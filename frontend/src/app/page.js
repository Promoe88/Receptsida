// ============================================
// Home Page — Dark Command Interface
// Daily Recommendation + Smart Fridge + Intelligence Grid
// ============================================

'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import { useRecipeSearch, useFavorites } from '../hooks/useRecipes';
import { DailyRecommendation } from '../components/DailyRecommendation';
import { SmartFridge } from '../components/SmartFridge';
import { HeroSearch } from '../components/HeroSearch';
import { RecipeGridCard } from '../components/RecipeGridCard';
import { RecipeDetail } from '../components/RecipeDetail';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { ShoppingList } from '../components/ShoppingList';
import { LoadingState } from '../components/LoadingState';
import { SourceBanner } from '../components/SourceBanner';
import { MOCK_RECIPES, getDailyRecommendation, filterRecipesByIngredients } from '../data/recipes';
import {
  ArrowLeft, Sparkles, TrendingDown, ChefHat, ShieldCheck,
  Search, LayoutGrid, Zap, Terminal,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuthStore();
  const { results, loading, error, search, reset } = useRecipeSearch();
  const { toggleFavorite } = useFavorites();
  const [lastQuery, setLastQuery] = useState('');

  const [searchTags, setSearchTags] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [smartFridgeMeals, setSmartFridgeMeals] = useState([]);

  const dailyRecipe = useMemo(() => getDailyRecommendation(), []);

  const filteredRecipes = useMemo(
    () => filterRecipesByIngredients(searchTags),
    [searchTags]
  );

  const handleMagicSearch = useCallback((tags) => {
    setSearchTags(tags);
    setSelectedRecipe(null);
  }, []);

  const handleMealsFound = useCallback((meals) => {
    setSmartFridgeMeals(meals);
  }, []);

  function handleApiSearch(query, householdSize) {
    if (!user) {
      window.location.href = '/login?redirect=/';
      return;
    }
    setLastQuery(query);
    search(query, householdSize);
  }

  function handleReset() {
    setSearchTags([]);
    setSelectedRecipe(null);
    reset();
  }

  // API Results view
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

  if (loading) return <LoadingState />;

  // Main dark command interface
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">

        {/* Top section: Daily + SmartFridge */}
        <div className="grid lg:grid-cols-5 gap-5 mb-10">
          <div className="lg:col-span-3">
            <DailyRecommendation
              recipe={dailyRecipe}
              onSelect={setSelectedRecipe}
            />
          </div>
          <div className="lg:col-span-2">
            <SmartFridge
              onMealsFound={handleMealsFound}
              onRecipeSelect={setSelectedRecipe}
            />
          </div>
        </div>

        {/* Smart Fridge Results */}
        <AnimatePresence>
          {smartFridgeMeals.length > 0 && searchTags.length === 0 && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-accent-400/10 flex items-center justify-center">
                  <ChefHat size={18} className="text-accent-400" />
                </div>
                <div>
                  <h2 className="font-display text-xl text-zinc-100">
                    Recept du kan laga nu
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">Baserat på ditt kylskåp</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartFridgeMeals.slice(0, 6).map((recipe, idx) => (
                  <RecipeGridCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={setSelectedRecipe}
                    index={idx}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Command Search */}
        <section className="mb-12">
          <HeroSearch onSearch={handleMagicSearch} loading={false} />
        </section>

        {/* Search Results Grid */}
        <AnimatePresence>
          {searchTags.length > 0 && filteredRecipes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-400/10 flex items-center justify-center">
                    <LayoutGrid size={18} className="text-accent-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-zinc-100">
                      {filteredRecipes.length} recept hittade
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                      Baserat på {searchTags.join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-zinc-500 hover:text-accent-400 transition-colors font-medium"
                >
                  Rensa
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe, idx) => (
                  <RecipeGridCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={setSelectedRecipe}
                    index={idx}
                  />
                ))}
              </div>
              {user && (
                <div className="mt-8 p-6 card-dark text-center">
                  <Sparkles size={20} className="text-accent-400 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400 mb-4">
                    Vill du ha <strong className="text-zinc-200">fler recept</strong> från hela webben?
                  </p>
                  <SearchBar onSearch={handleApiSearch} loading={loading} />
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* No search results */}
        {searchTags.length > 0 && filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto py-12 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-surface-300 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
              <Search size={22} className="text-zinc-500" />
            </div>
            <h3 className="font-display text-xl text-zinc-100 mb-2">Inga recept matchade</h3>
            <p className="text-sm text-zinc-500 mb-5">Prova andra ingredienser.</p>
            <button onClick={handleReset} className="btn-surface text-sm">Prova igen</button>
          </motion.div>
        )}

        {/* Features grid */}
        {searchTags.length === 0 && smartFridgeMeals.length === 0 && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-14">
              <FeatureCard
                icon={<Zap size={18} />}
                title="Noll beslutströtthet"
                text="Säg vad du har, vi löser middagen."
              />
              <FeatureCard
                icon={<TrendingDown size={18} />}
                title="Bästa priset"
                text="Prisjämför ICA, Willys, Coop och Lidl automatiskt."
              />
              <FeatureCard
                icon={<ShieldCheck size={18} />}
                title="Verifierade recept"
                text="Alla recept testade och kvalitetsgranskade."
              />
            </div>
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-accent-400/10 flex items-center justify-center">
                  <ChefHat size={18} className="text-accent-400" />
                </div>
                <h2 className="font-display text-xl text-zinc-100">Populära recept</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_RECIPES.slice(0, 3).map((recipe, idx) => (
                  <RecipeGridCard
                    key={recipe.id}
                    recipe={{ ...recipe, matchScore: 0 }}
                    onClick={setSelectedRecipe}
                    index={idx}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Login prompt */}
        {!user && searchTags.length === 0 && (
          <div className="mt-14 max-w-lg mx-auto text-center">
            <div className="card-dark px-6 py-6">
              <p className="text-sm text-zinc-400">
                <strong className="text-accent-400">Skapa ett gratis konto</strong> för att söka bland
                tusentals recept, spara favoriter och jämföra priser.{' '}
                <Link href="/register" className="text-accent-400 font-semibold underline underline-offset-2">
                  Registrera dig
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

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
