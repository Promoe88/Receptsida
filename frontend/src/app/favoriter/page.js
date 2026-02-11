// ============================================
// Favorites Page
// ============================================

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store';
import { useFavorites } from '../../hooks/useRecipes';
import { RecipeCard } from '../../components/RecipeCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { favorites, loading, loadFavorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (user) loadFavorites();
  }, [user, loadFavorites]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="skeleton w-48 h-8 mx-auto mb-4" />
        <div className="skeleton w-64 h-4 mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Heart size={48} className="text-warm-300 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-warm-800 mb-2">Logga in för favoriter</h2>
        <p className="text-warm-500 mb-6">Du behöver ett konto för att spara recept.</p>
        <Link href="/login?redirect=/favoriter" className="btn-primary inline-block">
          Logga in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-warm-800 mb-2">Mina favoriter</h1>
      <p className="text-warm-500 mb-8">Dina sparade recept samlade på ett ställe.</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card">
              <div className="skeleton w-48 h-6 mb-3" />
              <div className="skeleton w-full h-4 mb-2" />
              <div className="skeleton w-3/4 h-4" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="text-warm-200 mx-auto mb-4" />
          <h3 className="font-display text-xl text-warm-600 mb-2">Inga favoriter ännu</h3>
          <p className="text-warm-400 mb-6">
            Sök efter recept och klicka på hjärtat för att spara dem här.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Sök recept
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
