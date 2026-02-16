'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useRecipeStore } from '../../lib/store';
import { CookingMode } from '../../components/CookingMode';

export default function CookingPage() {
  const router = useRouter();
  const { selectedRecipe, clearRecipe } = useRecipeStore();

  // Redirect to home if no recipe (e.g. direct URL access or page refresh)
  useEffect(() => {
    if (!selectedRecipe) return;
    // Prevent scroll on the body while cooking
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [selectedRecipe]);

  function handleClose() {
    clearRecipe();
    router.back();
  }

  if (!selectedRecipe) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: '#1A1A2E', color: '#FFFFFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <ChefHat size={28} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-2">Inget recept valt</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Sök efter ett recept och tryck på "Börja laga" för att starta kokläget.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF' }}
          >
            <ArrowLeft size={16} />
            Tillbaka till sökning
          </button>
        </motion.div>
      </div>
    );
  }

  return <CookingMode recipe={selectedRecipe} onClose={handleClose} />;
}
