// ============================================
// SourceBanner — Web search sources display
// ============================================

import { Globe, ExternalLink } from 'lucide-react';

export function SourceBanner({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="card bg-gradient-to-br from-purple-50/50 to-forest-50/50 border-purple-100/50 mb-5">
      <div className="flex gap-3.5">
        <Globe size={22} className="text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warm-700">
            Recepten är baserade på riktiga källor från nätet
          </p>
          <p className="text-xs text-warm-400 mt-0.5">
            AI:n sökte, läste och anpassade dessa recept efter dina ingredienser och ditt hushåll.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full
                         text-xs text-brand-400 font-medium border border-warm-200
                         hover:bg-brand-50 hover:border-brand-200 transition-all duration-150"
              >
                📄 {source.title?.substring(0, 35)}{source.title?.length > 35 ? '...' : ''}
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
