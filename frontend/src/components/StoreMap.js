// ============================================
// Store Map — Find nearby grocery stores with GPS
// Uses global useLocation hook + Capacitor Geolocation
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Store, Loader2, AlertCircle } from 'lucide-react';
import { locations } from '../lib/api';
import { useLocation } from '../hooks/useLocation';

const CHAIN_COLORS = {
  ICA: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  Willys: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Coop: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  Lidl: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'Hemköp': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'City Gross': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

function getChainStyle(chain) {
  return CHAIN_COLORS[chain] || { bg: 'bg-warm-50', text: 'text-warm-600', border: 'border-warm-200' };
}

function formatDistance(meters) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function StoreMap() {
  const { lat, lng, loading: locLoading, error: locError, denied, hasPosition, requestLocation } = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStores = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const data = await locations.nearby(lat, lng);
      setStores(data.stores || []);
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
    <div className="space-y-4">
      {/* Header with locate button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-warm-800">Butiker nära dig</h2>
          <p className="text-sm text-warm-500">Hitta närmaste mataffär</p>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLoading}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MapPin size={16} />
          )}
          {hasPosition ? 'Uppdatera' : 'Hitta min plats'}
        </button>
      </div>

      {/* Error state */}
      {displayError && (
        <div className="bg-terra-50 border border-terra-200 text-terra-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {displayError}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasPosition && !displayError && (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-sage-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-sage-400" />
          </div>
          <p className="text-warm-600 font-medium mb-1">Aktivera platsåtkomst</p>
          <p className="text-sm text-warm-400">
            Tryck på &quot;Hitta min plats&quot; för att se butiker nära dig
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && stores.length === 0 && (
        <div className="card p-8 text-center">
          <Loader2 size={24} className="animate-spin text-sage-400 mx-auto mb-2" />
          <p className="text-sm text-warm-500">Söker efter butiker...</p>
        </div>
      )}

      {/* Store list */}
      {stores.length > 0 && (
        <div className="space-y-3">
          {stores.map((store) => {
            const style = getChainStyle(store.chain);
            return (
              <div key={store.id} className="card p-4 flex items-center gap-4">
                <div className={`w-12 h-12 ${style.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Store size={20} className={style.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-warm-800 text-sm truncate">{store.name}</h3>
                    {store.chain && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} ${style.border} border`}>
                        {store.chain}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-warm-500 truncate">{store.address}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium text-warm-600">
                      {formatDistance(store.distance)}
                    </span>
                    {store.openNow !== null && (
                      <span className={`text-xs font-medium ${store.openNow ? 'text-success-600' : 'text-terra-500'}`}>
                        {store.openNow ? 'Öppet' : 'Stängt'}
                      </span>
                    )}
                    {store.rating && (
                      <span className="text-xs text-warm-400">{store.rating} / 5</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => openDirections(store)}
                  className="flex-shrink-0 w-10 h-10 bg-sage-50 hover:bg-sage-100 rounded-xl
                           flex items-center justify-center transition-colors"
                  title="Vägbeskrivning"
                >
                  <Navigation size={18} className="text-sage-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
