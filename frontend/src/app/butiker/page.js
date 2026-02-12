// ============================================
// Butiker — Store finder page
// ============================================

import { StoreMap } from '../../components/StoreMap';

export const metadata = {
  title: 'Hitta butiker — Nisse / MatKompass',
  description: 'Hitta närmaste mataffär med GPS. Se ICA, Willys, Coop och Lidl nära dig.',
};

export default function StoresPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <StoreMap />
    </div>
  );
}
