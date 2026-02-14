// ============================================
// useLocation — Global location hook
// Capacitor Geolocation (native) + Web API (fallback)
// Zustand store + localStorage cache (5 min TTL)
// ============================================

'use client';

import { create } from 'zustand';
import { useCallback, useEffect, useRef } from 'react';
import { getCurrentPosition, checkLocationPermission, requestLocationPermission } from '../lib/capacitor';

const CACHE_KEY = 'matkompass_location';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── Read cached position from localStorage ──
function getCachedPosition() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached;
  } catch {
    return null;
  }
}

function setCachedPosition(lat, lng, accuracy) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      lat, lng, accuracy, timestamp: Date.now(),
    }));
  } catch {
    // localStorage might be full or unavailable
  }
}

// ── Zustand store — single source of truth for location ──
const useLocationStore = create((set) => ({
  lat: null,
  lng: null,
  accuracy: null,
  loading: false,
  error: null,
  denied: false,
  lastUpdated: null,
  permission: null, // 'granted' | 'denied' | 'prompt'

  _setPosition: (lat, lng, accuracy) => set({
    lat, lng, accuracy,
    loading: false,
    error: null,
    denied: false,
    lastUpdated: Date.now(),
  }),
  _setLoading: (loading) => set({ loading }),
  _setError: (error, denied = false) => set({ error, loading: false, denied }),
  _setPermission: (permission) => set({ permission }),
}));

// ── Hook ──
export function useLocation({ autoRequest = false } = {}) {
  const store = useLocationStore();
  const requestingRef = useRef(false);

  // On mount, hydrate from cache if store is empty
  useEffect(() => {
    if (store.lat !== null) return;
    const cached = getCachedPosition();
    if (cached) {
      store._setPosition(cached.lat, cached.lng, cached.accuracy);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check permission on mount
  useEffect(() => {
    checkLocationPermission().then((perm) => {
      store._setPermission(perm);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-request on mount if opted in and no cached position
  useEffect(() => {
    if (!autoRequest) return;
    if (store.lat !== null) return;
    if (store.denied) return;
    requestLocation();
  }, [autoRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestLocation = useCallback(async () => {
    if (requestingRef.current) return;
    requestingRef.current = true;

    const { _setLoading, _setPosition, _setError, _setPermission } = useLocationStore.getState();
    _setLoading(true);

    try {
      // Request permission on native first
      const perm = await requestLocationPermission();
      _setPermission(perm);

      if (perm === 'denied') {
        _setError('Platsåtkomst nekad. Aktivera plats i enhetens inställningar.', true);
        return;
      }

      const coords = await getCurrentPosition();
      const { latitude, longitude, accuracy } = coords;

      _setPosition(latitude, longitude, accuracy);
      setCachedPosition(latitude, longitude, accuracy);
    } catch (err) {
      const isDenied = err?.code === 1; // PERMISSION_DENIED
      _setError(
        isDenied
          ? 'Platsåtkomst nekad. Aktivera plats i inställningarna.'
          : 'Kunde inte hämta din position. Försök igen.',
        isDenied
      );
    } finally {
      requestingRef.current = false;
    }
  }, []);

  return {
    lat: store.lat,
    lng: store.lng,
    accuracy: store.accuracy,
    loading: store.loading,
    error: store.error,
    denied: store.denied,
    lastUpdated: store.lastUpdated,
    permission: store.permission,
    hasPosition: store.lat !== null && store.lng !== null,
    requestLocation,
  };
}
