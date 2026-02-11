// ============================================
// Root Layout — Premium app shell
// ============================================

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'MatKompass — Sveriges mest användbara receptsida',
  description:
    'Hitta recept baserat på vad du har hemma. Jämför priser hos ICA, Willys, Coop och Lidl. Ingen reklam, bara mat.',
  keywords: 'recept, matlagning, ingredienser, prisjämförelse, ICA, Willys, Coop, Lidl, Sverige',
  openGraph: {
    title: 'MatKompass — Sveriges mest användbara receptsida',
    description: 'Hitta recept baserat på vad du har hemma. Jämför priser hos svenska matbutiker.',
    type: 'website',
    locale: 'sv_SE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-cream-200/60 py-10 px-6">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-pine-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">M</span>
                </div>
                <p className="text-sm text-cream-500 font-light">MatKompass</p>
              </div>
              <p className="text-[11px] text-cream-400">
                Priser uppdateras regelbundet. Faktiska priser kan variera.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
