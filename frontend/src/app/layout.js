// ============================================
// Root Layout — Nisse / MatKompass
// ============================================

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../components/AuthProvider';
import { CookieConsent } from '../components/CookieConsent';

export const metadata = {
  title: 'Nisse — Hitta recept, jämför priser, hitta butiker',
  description:
    'Nisse är din personliga matassistent. Hitta recept, jämför priser hos ICA, Willys, Coop och Lidl. GPS-guidning till närmaste butik.',
  keywords: 'recept, matlagning, ingredienser, prisjämförelse, ICA, Willys, Coop, Lidl, butiker, GPS, Sverige',
  openGraph: {
    title: 'Nisse — Din personliga matassistent',
    description: 'Hitta recept, jämför priser och hitta närmaste butik med GPS.',
    type: 'website',
    locale: 'sv_SE',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <p className="text-sm text-warm-600 font-medium">Nisse</p>
              </div>
              <div className="flex items-center gap-4">
                <a href="/integritetspolicy" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
                  Integritetspolicy
                </a>
                <a href="/installningar" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
                  Inställningar
                </a>
              </div>
            </div>
          </footer>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
