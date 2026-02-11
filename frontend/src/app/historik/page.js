// ============================================
// History Page — Dark theme
// ============================================

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store';
import { useSearchHistory } from '../../hooks/useRecipes';
import { Clock, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { history, pagination, loading, loadHistory } = useSearchHistory();

  useEffect(() => {
    if (user) loadHistory();
  }, [user, loadHistory]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="h-8 w-48 bg-surface-300 rounded-lg animate-pulse mx-auto mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Clock size={48} className="text-zinc-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-zinc-100 mb-2">Logga in för historik</h2>
        <p className="text-zinc-500 mb-6">Du behöver ett konto för att se din sökhistorik.</p>
        <Link href="/login?redirect=/historik" className="btn-accent inline-block">
          Logga in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-zinc-100 mb-2">Sökhistorik</h1>
      <p className="text-zinc-500 mb-8">Dina tidigare receptsökningar.</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dark p-4">
              <div className="h-5 w-48 bg-surface-300 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-32 bg-surface-300 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="text-zinc-700 mx-auto mb-4" />
          <h3 className="font-display text-xl text-zinc-300 mb-2">Ingen historik ännu</h3>
          <p className="text-zinc-500 mb-6">Gör din första sökning!</p>
          <Link href="/" className="btn-accent inline-block">
            Sök recept
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {history.map((search) => (
              <div
                key={search.id}
                className="card-dark p-4 hover:shadow-medium transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent-400/10 text-accent-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{search.query}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                      {new Date(search.createdAt).toLocaleDateString('sv-SE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {search.resultCount} recept
                      {' · '}
                      {search.householdSize} pers
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {search.recipes?.slice(0, 2).map((r) => (
                      <span key={r.id} className="badge-surface text-xs">
                        {r.title}
                      </span>
                    ))}
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => loadHistory(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all font-mono
                    ${pagination.page === i + 1
                      ? 'bg-accent-400 text-void'
                      : 'bg-surface-300 border border-zinc-800 text-zinc-400 hover:border-accent-400/30'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
