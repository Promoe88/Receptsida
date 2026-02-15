// ============================================
// StoreGoogleMap — Real Google Maps with chain-specific pins
// Custom markers for ICA, Coop, Willys, Lidl, Hemköp, City Gross
// InfoWindow with store details + navigation button
// ============================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Navigation, Clock, Star, MapPin, AlertTriangle } from 'lucide-react';

// ── Chain marker colors ──
const CHAIN_MARKERS = {
  ICA: { color: '#E3000B', label: 'I', name: 'ICA' },
  Willys: { color: '#C8102E', label: 'W', name: 'Willys' },
  Coop: { color: '#00843D', label: 'C', name: 'Coop' },
  Lidl: { color: '#0050AA', label: 'L', name: 'Lidl' },
  Hemköp: { color: '#F07D00', label: 'H', name: 'Hemköp' },
  'City Gross': { color: '#FFD700', label: 'G', name: 'City Gross' },
};

const DEFAULT_MARKER = { color: '#5A7D6C', label: '?', name: 'Butik' };

// ── Custom SVG pin generator ──
function createChainMarkerIcon(chain) {
  const config = CHAIN_MARKERS[chain] || DEFAULT_MARKER;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M20 51 C20 51 2 32 2 18 C2 8.06 10.06 0 20 0 C29.94 0 38 8.06 38 18 C38 32 20 51 20 51Z"
            fill="${config.color}" filter="url(#shadow)" stroke="white" stroke-width="2"/>
      <circle cx="20" cy="18" r="12" fill="white" opacity="0.95"/>
      <text x="20" y="23" text-anchor="middle" font-size="14" font-weight="700"
            fill="${config.color}" font-family="Inter, system-ui, sans-serif">${config.label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── User location blue dot ──
function createUserMarkerIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#4285F4" stroke="white" stroke-width="2.5"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Map styling — clean, muted, Scandinavian feel ──
const MAP_STYLES = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d6df' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0f0f0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7c7c7c' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e8e8e8' }] },
];

const MAP_OPTIONS = {
  styles: MAP_STYLES,
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
  clickableIcons: false,
};

function formatDistance(meters) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function StoreGoogleMap({
  stores = [],
  userLat,
  userLng,
  selectedStoreId,
  onStoreSelect,
  onNavigate,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [infoStore, setInfoStore] = useState(null);
  const [authError, setAuthError] = useState(false);
  const mapRef = useRef(null);

  // Detect Google Maps API key / billing errors
  useEffect(() => {
    window.gm_authFailure = () => setAuthError(true);
    return () => { delete window.gm_authFailure; };
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Pan to store when selected from list
  const panToStore = useCallback((store) => {
    if (mapRef.current && store) {
      mapRef.current.panTo({ lat: store.lat, lng: store.lng });
      mapRef.current.setZoom(16);
      setInfoStore(store);
    }
  }, []);

  // Pan to user location
  const panToUser = useCallback(() => {
    if (mapRef.current && userLat && userLng) {
      mapRef.current.panTo({ lat: userLat, lng: userLng });
      mapRef.current.setZoom(14);
    }
  }, [userLat, userLng]);

  // When selectedStoreId changes from parent, pan map
  const prevSelectedRef = useRef(null);
  if (selectedStoreId && selectedStoreId !== prevSelectedRef.current) {
    prevSelectedRef.current = selectedStoreId;
    const store = stores.find((s) => s.id === selectedStoreId);
    if (store && mapRef.current) {
      panToStore(store);
    }
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
        <div className="text-center px-6">
          <MapPin size={32} className="text-warm-400 mx-auto mb-3" />
          <p className="text-warm-600 font-medium">Kartan kunde inte laddas</p>
          <p className="text-sm text-warm-400 mt-1">
            Kontrollera att Google Maps API-nyckeln är giltig och att Maps JavaScript API är aktiverat i Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-warm-500">Laddar karta...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
        <div className="text-center px-6">
          <AlertTriangle size={32} className="text-orange-400 mx-auto mb-3" />
          <p className="text-warm-600 font-medium">Google Maps kunde inte autentisera</p>
          <p className="text-sm text-warm-400 mt-1">
            Kontrollera att API-nyckeln har Maps JavaScript API aktiverat, att fakturering är påslagen,
            och att localhost finns med i tillåtna referrers i Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  const center = userLat && userLng
    ? { lat: userLat, lng: userLng }
    : { lat: 59.3293, lng: 18.0686 }; // Stockholm fallback

  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={14}
        options={MAP_OPTIONS}
        onLoad={onMapLoad}
        onClick={() => setInfoStore(null)}
      >
        {/* User position marker */}
        {userLat && userLng && (
          <MarkerF
            position={{ lat: userLat, lng: userLng }}
            icon={{
              url: createUserMarkerIcon(),
              scaledSize: { width: 24, height: 24 },
              anchor: { x: 12, y: 12 },
            }}
            zIndex={1000}
            title="Din plats"
          />
        )}

        {/* Store markers */}
        {stores.map((store) => (
          <MarkerF
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            icon={{
              url: createChainMarkerIcon(store.chain),
              scaledSize: { width: 40, height: 52 },
              anchor: { x: 20, y: 52 },
            }}
            zIndex={store.id === selectedStoreId ? 999 : 100}
            onClick={() => {
              setInfoStore(store);
              onStoreSelect?.(store.id);
            }}
          />
        ))}

        {/* InfoWindow for selected store */}
        {infoStore && (
          <InfoWindowF
            position={{ lat: infoStore.lat, lng: infoStore.lng }}
            onCloseClick={() => setInfoStore(null)}
            options={{ pixelOffset: { width: 0, height: -52 } }}
          >
            <div style={{ minWidth: 200, maxWidth: 260, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: (CHAIN_MARKERS[infoStore.chain] || DEFAULT_MARKER).color,
                    color: 'white', fontSize: 13, fontWeight: 700,
                  }}
                >
                  {(CHAIN_MARKERS[infoStore.chain] || DEFAULT_MARKER).label}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>
                    {infoStore.name}
                  </div>
                  {infoStore.chain && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
                      backgroundColor: (CHAIN_MARKERS[infoStore.chain] || DEFAULT_MARKER).color + '18',
                      color: (CHAIN_MARKERS[infoStore.chain] || DEFAULT_MARKER).color,
                    }}>
                      {infoStore.chain}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                {infoStore.address}
              </div>

              <div style={{ display: 'flex', gap: 12, fontSize: 12, marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  {formatDistance(infoStore.distance)}
                </span>
                {infoStore.openNow !== null && (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 3,
                    color: infoStore.openNow ? '#16a34a' : '#dc2626',
                    fontWeight: 500,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: infoStore.openNow ? '#16a34a' : '#dc2626',
                    }} />
                    {infoStore.openNow ? 'Öppet nu' : 'Stängt'}
                  </span>
                )}
                {infoStore.rating && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#888' }}>
                    <span style={{ color: '#facc15' }}>&#9733;</span> {infoStore.rating}
                  </span>
                )}
              </div>

              <button
                onClick={() => onNavigate?.(infoStore)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%', padding: '8px 0', borderRadius: 9999,
                  backgroundColor: '#2ABFBF', color: 'white',
                  border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Navigera hit
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Floating center-on-me button */}
      {userLat && userLng && (
        <button
          onClick={panToUser}
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-white rounded-full shadow-elevated
                   flex items-center justify-center active:scale-95 transition-transform"
          title="Centrera på mig"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A7D6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
      )}
    </div>
  );
}
