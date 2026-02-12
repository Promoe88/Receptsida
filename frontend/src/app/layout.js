// ============================================
// Root Layout — Modern Scandinavian Kitchen
// ============================================

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'MatKompass — Hitta recept, jämför priser, laga mat',
  description:
    'Hitta recept baserat på vad du har hemma. Jämför priser hos ICA, Willys, Coop och Lidl. Röststyrd matlagning med AI-kock.',
  keywords: 'recept, matlagning, ingredienser, prisjämförelse, ICA, Willys, Coop, Lidl, Sverige',
  openGraph: {
    title: 'MatKompass — Hitta recept, jämför priser, laga mat',
    description: 'Hitta recept baserat på vad du har hemma. Röststyrd matlagning med AI-kockassistent.',
    type: 'website',
    locale: 'sv_SE',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Required for iOS safe area insets
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className="min-h-screen flex flex-col safe-left safe-right">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-warm-200 py-10 px-6 bg-cream-200 safe-bottom">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-sage-400 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <p className="text-sm text-warm-600 font-medium">MatKompass</p>
              </div>
              <p className="text-xs text-warm-400">
                Priser uppdateras regelbundet. Faktiska priser kan variera.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
