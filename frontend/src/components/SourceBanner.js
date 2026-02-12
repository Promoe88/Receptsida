// ============================================
// SourceBanner — Soft UI web search sources
// ============================================

import { Globe, ExternalLink } from 'lucide-react';

export function SourceBanner({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="card shadow-card p-5 mb-5">
      <div className="flex gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-sage-50 flex items-center justify-center flex-shrink-0">
          <Globe size={20} className="text-sage-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-warm-800">
            Recepten är baserade på riktiga källor från nätet
          </p>
          <p className="text-xs text-warm-500 mt-0.5">
            AI:n sökte, läste och anpassade dessa recept efter dina ingredienser och ditt hushåll.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-cream-100 px-3 py-1.5 rounded-full
                         text-xs text-sage-600 font-medium border border-warm-200/50
                         hover:bg-sage-50 hover:border-sage-300 transition-all duration-150"
              >
                {source.title?.substring(0, 35)}{source.title?.length > 35 ? '...' : ''}
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
