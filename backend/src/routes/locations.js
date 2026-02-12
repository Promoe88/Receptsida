// ============================================
// Location Routes — Nearby stores via Google Maps
// ============================================

import { Router } from 'express';
import { config } from '../config/env.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// Swedish grocery store chains we search for
const STORE_CHAINS = ['ICA', 'Willys', 'Coop', 'Lidl', 'Hemköp', 'City Gross'];

// ──────────────────────────────────────────
// GET /locations/nearby — Find nearby grocery stores
// ──────────────────────────────────────────
router.get(
  '/nearby',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      throw new AppError(400, 'missing_coords', 'Latitud och longitud krävs.');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = Math.min(parseInt(radius) || 5000, 50000); // Default 5km, max 50km

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'invalid_coords', 'Ogiltiga koordinater.');
    }

    if (latitude < 55 || latitude > 70 || longitude < 10 || longitude > 25) {
      throw new AppError(400, 'out_of_range', 'Koordinaterna verkar inte vara i Sverige.');
    }

    if (!config.GOOGLE_MAPS_API_KEY) {
      // Return mock data when API key isn't configured
      return res.json({
        stores: getMockStores(latitude, longitude),
        source: 'mock',
        note: 'Google Maps API-nyckel saknas. Visar exempeldata.',
      });
    }

    // Use Google Places API (Nearby Search)
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${latitude},${longitude}`);
    url.searchParams.set('radius', String(searchRadius));
    url.searchParams.set('type', 'supermarket');
    url.searchParams.set('language', 'sv');
    url.searchParams.set('key', config.GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      throw new AppError(502, 'maps_error', 'Kunde inte hämta butiker. Försök igen senare.');
    }

    const stores = (data.results || []).map((place) => {
      const chain = identifyChain(place.name);
      return {
        id: place.place_id,
        name: place.name,
        chain,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || null,
        openNow: place.opening_hours?.open_now ?? null,
        distance: calculateDistance(
          latitude, longitude,
          place.geometry.location.lat, place.geometry.location.lng
        ),
      };
    });

    // Sort by distance
    stores.sort((a, b) => a.distance - b.distance);

    res.json({
      stores,
      source: 'google_maps',
      center: { lat: latitude, lng: longitude },
      radius: searchRadius,
    });
  })
);

// ──────────────────────────────────────────
// GET /locations/directions — Get directions to a store
// ──────────────────────────────────────────
router.get(
  '/directions',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { fromLat, fromLng, toLat, toLng, mode } = req.query;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      throw new AppError(400, 'missing_coords', 'Start- och slutkoordinater krävs.');
    }

    const travelMode = ['driving', 'walking', 'bicycling', 'transit'].includes(mode)
      ? mode
      : 'driving';

    if (!config.GOOGLE_MAPS_API_KEY) {
      return res.json({
        directionsUrl: `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`,
        mode: travelMode,
        source: 'redirect',
      });
    }

    // Build a direct Google Maps link (most reliable cross-platform)
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=${travelMode}`;

    res.json({
      directionsUrl,
      mode: travelMode,
      source: 'google_maps',
    });
  })
);

// ── Helpers ──

function identifyChain(name) {
  const upper = name.toUpperCase();
  for (const chain of STORE_CHAINS) {
    if (upper.includes(chain.toUpperCase())) return chain;
  }
  return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getMockStores(lat, lng) {
  return [
    {
      id: 'mock_ica_1',
      name: 'ICA Supermarket',
      chain: 'ICA',
      address: 'Exempelgatan 1',
      lat: lat + 0.005,
      lng: lng + 0.003,
      rating: 4.2,
      openNow: true,
      distance: 450,
    },
    {
      id: 'mock_willys_1',
      name: 'Willys',
      chain: 'Willys',
      address: 'Storgatan 15',
      lat: lat - 0.003,
      lng: lng + 0.008,
      rating: 3.9,
      openNow: true,
      distance: 820,
    },
    {
      id: 'mock_coop_1',
      name: 'Coop Konsum',
      chain: 'Coop',
      address: 'Handelsvägen 7',
      lat: lat + 0.01,
      lng: lng - 0.005,
      rating: 4.0,
      openNow: false,
      distance: 1200,
    },
    {
      id: 'mock_lidl_1',
      name: 'Lidl',
      chain: 'Lidl',
      address: 'Industrivägen 22',
      lat: lat - 0.008,
      lng: lng - 0.002,
      rating: 3.7,
      openNow: true,
      distance: 1850,
    },
  ];
}

export default router;
