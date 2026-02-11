// ============================================
// SourceBanner — Dark theme web search sources
// ============================================

import { Globe, ExternalLink } from 'lucide-react';

export function SourceBanner({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="card-dark p-5 mb-5">
      <div className="flex gap-3.5">
        <Globe size={22} className="text-accent-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-zinc-200">
            Recepten är baserade på riktiga källor från nätet
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            AI:n sökte, läste och anpassade dessa recept efter dina ingredienser och ditt hushåll.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-surface-300 px-3 py-1.5 rounded-lg
                         text-xs text-accent-400 font-medium border border-zinc-800
                         hover:bg-surface-200 hover:border-accent-400/30 transition-all duration-150"
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
