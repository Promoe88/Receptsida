// ============================================
// Butiker — Map-centric store finder
// Full-height map area with sliding list overlay
// Uses global useLocation hook + Capacitor Geolocation
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Store, Loader2, AlertCircle, ChevronUp, ChevronDown, LocateFixed } from 'lucide-react';
import { locations } from '../../lib/api';
import { isApp } from '../../lib/platform';
import { NisseButton } from '../../components/NisseButton';
import { PageTransition } from '../../components/PageTransition';
import { useLocation } from '../../hooks/useLocation';

const CHAIN_COLORS = {
  ICA: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  Willys: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Coop: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  Lidl: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  Hemköp: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'City Gross': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

function getChainStyle(chain) {
  return CHAIN_COLORS[chain] || { bg: 'bg-warm-50', text: 'text-warm-600', border: 'border-warm-200' };
}

function formatDistance(meters) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function StoresPage() {
  const { lat, lng, loading: locLoading, error: locError, hasPosition, requestLocation } = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listExpanded, setListExpanded] = useState(false);

  const fetchStores = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const data = await locations.nearby(lat, lng);
      setStores(data.stores || []);
      if (data.stores?.length > 0) setListExpanded(true);
    } catch (err) {
      setError(err.message || 'Kunde inte hämta butiker.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stores whenever position updates
  useEffect(() => {
    if (hasPosition) fetchStores(lat, lng);
  }, [hasPosition, lat, lng, fetchStores]);

  async function openDirections(store) {
    if (!hasPosition) return;
    try {
      const data = await locations.directions(lat, lng, store.lat, store.lng, 'driving');
      window.open(data.directionsUrl, '_blank');
    } catch {
      window.open(
        `https://www.google.com/maps/dir/${lat},${lng}/${store.lat},${store.lng}`,
        '_blank'
      );
    }
  }

  const isLoading = locLoading || loading;
  const displayError = locError || error;

  return (
    <PageTransition className={isApp ? 'safe-top' : ''}>
      <div className="relative flex flex-col" style={{ minHeight: isApp ? 'calc(100vh - 64px)' : 'calc(100vh - 80px)' }}>

        {/* Map placeholder area */}
        <div className="flex-1 bg-cream-200 relative flex items-center justify-center">
          {/* Decorative map grid */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'linear-gradient(rgba(45,42,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(45,42,38,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {!hasPosition && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center z-10 px-6"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-elevated">
                <MapPin size={36} className="text-sage-400" />
              </div>
              <h2 className="font-display text-2xl text-warm-800 mb-2">Hitta butiker nära dig</h2>
              <p className="text-sm text-warm-500 mb-6 max-w-xs mx-auto">
                Aktivera platsåtkomst för att se ICA, Willys, Coop och Lidl i närheten
              </p>
              <NisseButton variant="primary" size="lg" onClick={requestLocation}>
                <LocateFixed size={18} /> Hitta min plats
              </NisseButton>
            </motion.div>
          )}

          {isLoading && stores.length === 0 && (
            <div className="text-center z-10">
              <Loader2 size={32} className="animate-spin text-sage-400 mx-auto mb-3" />
              <p className="text-sm text-warm-500 font-medium">Söker efter butiker...</p>
            </div>
          )}

          {hasPosition && !isLoading && stores.length === 0 && !displayError && (
            <div className="text-center z-10 px-6">
              <Store size={32} className="text-warm-400 mx-auto mb-3" />
              <p className="text-warm-500">Inga butiker hittades i närheten</p>
            </div>
          )}

          {/* Floating locate button (when stores loaded) */}
          {hasPosition && stores.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={requestLocation}
              className="absolute top-4 right-4 z-20 w-11 h-11 bg-white rounded-full shadow-elevated
                       flex items-center justify-center active:scale-95 transition-transform"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-sage-400" />
              ) : (
                <LocateFixed size={18} className="text-sage-400" />
              )}
            </motion.button>
          )}
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 right-4 z-30 bg-danger-50 border border-danger/20 text-terra-600
                       px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-medium"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="flex-1">{displayError}</span>
              <button onClick={() => setError(null)} className="text-terra-400 font-bold text-lg leading-none">&times;</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sliding store list overlay */}
        {stores.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-t-3xl shadow-strong relative z-20"
          >
            {/* Drag handle */}
            <button
              onClick={() => setListExpanded(!listExpanded)}
              className="w-full pt-3 pb-2 flex flex-col items-center"
            >
              <div className="w-10 h-1 bg-warm-200 rounded-full mb-2" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-warm-700">
                  {stores.length} butiker nära dig
                </span>
                {listExpanded ? <ChevronDown size={16} className="text-warm-400" /> : <ChevronUp size={16} className="text-warm-400" />}
              </div>
            </button>

            {/* Store list */}
            <AnimatePresence>
              {listExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2.5 max-h-[50vh] soft-scroll">
                    {stores.map((store, idx) => {
                      const style = getChainStyle(store.chain);
                      return (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-cream-100 border border-warm-100"
                        >
                          <div className={`w-11 h-11 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Store size={18} className={style.text} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-warm-800 text-sm truncate">{store.name}</h3>
                              {store.chain && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} font-semibold`}>
                                  {store.chain}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-warm-500 truncate">{store.address}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs font-semibold text-warm-600">
                                {formatDistance(store.distance)}
                              </span>
                              {store.openNow !== null && (
                                <span className={`text-xs font-medium ${store.openNow ? 'text-success-600' : 'text-terra-500'}`}>
                                  {store.openNow ? 'Öppet' : 'Stängt'}
                                </span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openDirections(store)}
                            className="flex-shrink-0 w-10 h-10 bg-sage-50 hover:bg-sage-100 rounded-xl
                                     flex items-center justify-center transition-colors"
                          >
                            <Navigation size={16} className="text-sage-500" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
