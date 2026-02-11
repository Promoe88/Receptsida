// ============================================
// History Page
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
        <div className="skeleton w-48 h-8 mx-auto mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Clock size={48} className="text-warm-300 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-warm-800 mb-2">Logga in för historik</h2>
        <p className="text-warm-500 mb-6">Du behöver ett konto för att se din sökhistorik.</p>
        <Link href="/login?redirect=/historik" className="btn-primary inline-block">
          Logga in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl text-warm-800 mb-2">Sökhistorik</h1>
      <p className="text-warm-500 mb-8">Dina tidigare receptsökningar.</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card !py-4">
              <div className="skeleton w-48 h-5 mb-2" />
              <div className="skeleton w-32 h-4" />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="text-warm-200 mx-auto mb-4" />
          <h3 className="font-display text-xl text-warm-600 mb-2">Ingen historik ännu</h3>
          <p className="text-warm-400 mb-6">Gör din första sökning!</p>
          <Link href="/" className="btn-primary inline-block">
            Sök recept
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {history.map((search) => (
              <div
                key={search.id}
                className="card !py-4 hover:shadow-medium transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-50 text-brand-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-warm-800 truncate">{search.query}</p>
                    <p className="text-xs text-warm-400 mt-0.5">
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
                      <span key={r.id} className="badge bg-warm-50 text-warm-600 text-xs">
                        {r.title}
                      </span>
                    ))}
                  </div>
                  <ChevronRight size={18} className="text-warm-300 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => loadHistory(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                    ${pagination.page === i + 1
                      ? 'bg-brand-400 text-white'
                      : 'bg-white border border-warm-200 text-warm-600 hover:border-brand-400'
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
