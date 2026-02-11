// ============================================
// Root Layout — App shell
// ============================================

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'MatKompass — Sveriges mest användbara receptsida',
  description:
    'Hitta recept baserat på vad du har hemma. Jämför priser hos ICA, Willys, Coop och Lidl. Enkel, snabb och utan reklam.',
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
          <footer className="border-t border-warm-200 py-10 px-6">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-warm-400 font-light">
                MatKompass — Sveriges mest användbara receptsida
              </p>
              <p className="text-xs text-warm-300">
                Priser uppdateras regelbundet. Faktiska priser kan variera.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
