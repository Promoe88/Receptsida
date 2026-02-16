'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useRecipeStore } from '../../lib/store';
import { CookingMode } from '../../components/CookingMode';
import { useVoiceInput } from '../../hooks/useVoice';
import { cooking } from '../../lib/api';

export default function CookingPage() {
  const router = useRouter();
  const { selectedRecipe, clearRecipe } = useRecipeStore();
  const { isListening, transcript, supported, startListening, stopListening, resetTranscript } = useVoiceInput();
  const [voiceText, setVoiceText] = useState('');
  const [nisseReply, setNisseReply] = useState('');
  const [nisseLoading, setNisseLoading] = useState(false);

  useEffect(() => {
    if (!selectedRecipe) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [selectedRecipe]);

  const handleVoiceResult = useCallback(async (finalText) => {
    setVoiceText(finalText);
    setNisseReply('');
    setNisseLoading(true);
    try {
      const data = await cooking.speak(finalText, selectedRecipe);
      setNisseReply(data.reply ?? data.answer ?? '');
    } catch {
      setNisseReply('Nisse kunde inte svara just nu. Försök igen.');
    } finally {
      setNisseLoading(false);
    }
  }, [selectedRecipe]);

  function toggleMic() {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setVoiceText('');
      setNisseReply('');
      startListening(handleVoiceResult);
    }
  }

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

  const bubbleStyle = {
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  };

  return (
    <div className="relative">
      <CookingMode recipe={selectedRecipe} onClose={handleClose} />

      {/* Voice conversation bubbles */}
      <AnimatePresence>
        {(isListening || transcript || voiceText || nisseReply || nisseLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-4 right-4 bottom-28 z-[60] flex flex-col items-center gap-3 pointer-events-none"
          >
            {/* User bubble */}
            <div
              className="px-5 py-3 rounded-2xl text-sm text-white max-w-md text-center"
              style={{ background: 'rgba(30,41,59,0.95)', ...bubbleStyle }}
            >
              {transcript || voiceText || (
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Lyssnar...
                </span>
              )}
            </div>

            {/* Nisse reply bubble */}
            {(nisseLoading || nisseReply) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-3 rounded-2xl text-sm text-white max-w-md text-center"
                style={{ background: 'rgba(255,107,53,0.85)', ...bubbleStyle }}
              >
                {nisseLoading ? (
                  <span className="inline-flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    >.</motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    >.</motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    >.</motion.span>
                  </span>
                ) : nisseReply}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating mic button */}
      {supported && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMic}
          className="fixed bottom-6 right-6 z-[60] rounded-full flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            background: isListening ? '#FF6B35' : 'rgba(255,255,255,0.1)',
            border: isListening ? '2px solid #FF6B35' : '2px solid rgba(255,255,255,0.15)',
            boxShadow: isListening ? '0 0 24px rgba(255,107,53,0.4)' : '0 4px 16px rgba(0,0,0,0.3)',
            color: '#FFF',
          }}
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid #FF6B35' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      )}
    </div>
  );
}
