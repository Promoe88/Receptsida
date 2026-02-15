// ============================================
// Root Layout — Nisse
// Platform-aware: Web (Navbar+Footer) vs App (TabBar)
// ============================================

import '../styles/globals.css';
import { AuthProvider } from '../components/AuthProvider';
import { ToastProvider } from '../components/Toast';
import { LayoutShell } from '../components/LayoutShell';

export const metadata = {
  title: 'Nisse — Hitta recept, jämför priser, hitta butiker',
  description:
    'Nisse är din personliga matassistent. Hitta recept, jämför priser hos ICA, Willys, Coop och Lidl. GPS-guidning till närmaste butik.',
  keywords: 'recept, matlagning, ingredienser, prisjämförelse, ICA, Willys, Coop, Lidl, butiker, GPS, Sverige',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ToastProvider>
            <LayoutShell>{children}</LayoutShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
