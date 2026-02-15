// ============================================
// Butiker — Full Google Maps store finder
// Real map with chain-specific pins (ICA, Coop, Willys, Lidl…)
// Sliding store list + tap-to-navigate + InfoWindow
// ============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Store, Loader2, AlertCircle,
  ChevronUp, ChevronDown, LocateFixed, Car, Bike, Footprints,
} from 'lucide-react';
import { locations } from '../../lib/api';
import { isApp } from '../../lib/platform';
import { NisseButton } from '../../components/NisseButton';
import { StoreGoogleMap } from '../../components/StoreGoogleMap';
import { useLocation } from '../../hooks/useLocation';

const CHAIN_COLORS = {
  ICA: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: '#E3000B' },
  Willys: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: '#C8102E' },
  Coop: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', dot: '#00843D' },
  Lidl: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: '#0050AA' },
  Hemköp: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: '#F07D00' },
  'City Gross': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: '#FFD700' },
};

const TRAVEL_MODES = [
  { key: 'driving', icon: Car, label: 'Bil' },
  { key: 'walking', icon: Footprints, label: 'Gång' },
  { key: 'bicycling', icon: Bike, label: 'Cykel' },
];

function getChainStyle(chain) {
  return CHAIN_COLORS[chain] || { bg: 'bg-warm-50', text: 'text-warm-600', border: 'border-warm-200', dot: '#5A7D6C' };
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
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [travelMode, setTravelMode] = useState('driving');

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

  useEffect(() => {
    if (hasPosition) fetchStores(lat, lng);
  }, [hasPosition, lat, lng, fetchStores]);

  async function openDirections(store) {
    if (!hasPosition) return;
    try {
      const data = await locations.directions(lat, lng, store.lat, store.lng, travelMode);
      window.open(data.directionsUrl, '_blank');
    } catch {
      window.open(
        `https://www.google.com/maps/dir/${lat},${lng}/${store.lat},${store.lng}`,
        '_blank'
      );
    }
  }

  function handleStoreSelect(storeId) {
    setSelectedStoreId(storeId);
  }

  function handleListStoreClick(store) {
    setSelectedStoreId(store.id);
  }

  const isLoading = locLoading || loading;
  const displayError = locError || error;
  const hasGoogleMapsKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className={isApp ? 'safe-top' : ''}>
      <div className="relative" style={{ height: isApp ? 'calc(100dvh - 64px)' : 'calc(100dvh - 80px)' }}>

        {/* Map area — full size, everything else overlays on top */}
        {hasGoogleMapsKey && hasPosition ? (
          <StoreGoogleMap
            stores={stores}
            userLat={lat}
            userLng={lng}
            selectedStoreId={selectedStoreId}
            onStoreSelect={handleStoreSelect}
            onNavigate={openDirections}
          />
        ) : (
          <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
            {/* Decorative grid fallback when no API key or no position */}
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
                  Aktivera platsåtkomst för att se ICA, Coop, Willys och fler på kartan
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

            {!hasGoogleMapsKey && hasPosition && (
              <div className="text-center z-10 px-6">
                <MapPin size={32} className="text-warm-400 mx-auto mb-3" />
                <p className="text-warm-600 font-medium">Google Maps API-nyckel saknas</p>
                <p className="text-sm text-warm-400 mt-1">
                  Lägg till NEXT_PUBLIC_GOOGLE_MAPS_API_KEY i .env.local och bygg om appen.
                </p>
              </div>
            )}
          </div>
        )}

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

        {/* Sliding store list overlay — positioned at bottom of map */}
        {stores.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-strong z-20"
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

            {/* Travel mode picker */}
            <AnimatePresence>
              {listExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Travel mode tabs */}
                  <div className="px-4 pb-2 flex gap-2">
                    {TRAVEL_MODES.map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setTravelMode(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                          ${travelMode === key
                            ? 'bg-sage-400 text-white shadow-sm'
                            : 'bg-cream-100 text-warm-500 hover:bg-cream-200'
                          }`}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Store cards */}
                  <div className="px-4 pb-4 space-y-2.5 max-h-[50vh] soft-scroll">
                    {stores.map((store, idx) => {
                      const style = getChainStyle(store.chain);
                      const isSelected = store.id === selectedStoreId;
                      return (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onClick={() => handleListStoreClick(store)}
                          className={`flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all
                            ${isSelected
                              ? 'bg-sage-50 border-2 border-sage-300 shadow-sm'
                              : 'bg-cream-100 border border-warm-100 hover:border-warm-200'
                            }`}
                        >
                          {/* Chain color dot */}
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}
                            style={{ backgroundColor: style.dot + '15' }}
                          >
                            <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: style.dot }}
                            >
                              <Store size={12} className="text-white" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-warm-800 text-sm truncate">{store.name}</h3>
                              {store.chain && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                                  style={{
                                    backgroundColor: style.dot + '15',
                                    color: style.dot,
                                  }}
                                >
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
                                <span className="flex items-center gap-1">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: store.openNow ? '#16a34a' : '#dc2626' }}
                                  />
                                  <span className={`text-xs font-medium ${store.openNow ? 'text-success-600' : 'text-terra-500'}`}>
                                    {store.openNow ? 'Öppet' : 'Stängt'}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Navigate button */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDirections(store);
                            }}
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
    </div>
  );
}
