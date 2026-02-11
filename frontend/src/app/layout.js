// ============================================
// Root Layout — App shell
// ============================================

import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'MatKompass — Vad har du i kylen?',
  description:
    'Sveriges smartaste receptverktyg. Skriv in dina ingredienser — vi hittar perfekta recept anpassade efter dig.',
  keywords: 'recept, matlagning, ingredienser, AI, Sverige, enkel mat',
  openGraph: {
    title: 'MatKompass — Vad har du i kylen?',
    description: 'AI-driven receptsökning baserad på dina ingredienser.',
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
          <footer className="border-t border-warm-200 py-8 px-6 text-center">
            <p className="text-sm text-warm-500">
              © {new Date().getFullYear()} MatKompass — Byggt med kärlek för Sveriges matlagare
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
