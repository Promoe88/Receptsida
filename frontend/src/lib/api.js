// ============================================
// API Client — Typed HTTP client for backend
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ── Token management ──

let accessToken = null;
let refreshToken = null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('mk_refresh', refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mk_refresh');
  }
}

export function getStoredRefreshToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mk_refresh');
  }
  return null;
}

// ── Core fetch wrapper with auto-refresh ──

async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiError(0, 'network_error', 'Kunde inte nå servern. Kontrollera din internetanslutning och försök igen.');
  }

  // Auto-refresh on 401
  if (response.status === 401 && refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      try {
        response = await fetch(url, { ...options, headers });
      } catch {
        throw new ApiError(0, 'network_error', 'Kunde inte nå servern. Kontrollera din internetanslutning och försök igen.');
      }
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      body.error || 'unknown',
      body.message || 'Något gick fel'
    );
  }

  return response.json();
}

async function tryRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

// ── Auth API ──

export const auth = {
  async register(email, password, name, householdSize) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, householdSize }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },

  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  async me() {
    return apiFetch('/auth/me');
  },

  async verify(token) {
    return apiFetch('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async resendVerification() {
    return apiFetch('/auth/resend-verification', { method: 'POST' });
  },

  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, password) {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  async googleLogin(idToken) {
    const data = await apiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return { user: data.user, isNewUser: data.isNewUser };
  },

  async appleLogin(identityToken, authorizationCode, fullName) {
    const data = await apiFetch('/auth/apple', {
      method: 'POST',
      body: JSON.stringify({ identityToken, authorizationCode, fullName }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return { user: data.user, isNewUser: data.isNewUser };
  },

  async completeOnboarding() {
    return apiFetch('/auth/complete-onboarding', { method: 'POST' });
  },

  async initFromStorage() {
    const stored = getStoredRefreshToken();
    if (!stored) return null;

    refreshToken = stored;
    const refreshed = await tryRefresh();
    if (!refreshed) return null;

    return auth.me();
  },
};

// ── GDPR API ──

export const gdpr = {
  async recordConsent(type, granted) {
    return apiFetch('/gdpr/consent', {
      method: 'POST',
      body: JSON.stringify({ type, granted }),
    });
  },

  async getConsent() {
    return apiFetch('/gdpr/consent');
  },

  async exportData() {
    return apiFetch('/gdpr/export');
  },

  async deleteAccount(confirmEmail) {
    return apiFetch('/gdpr/delete-account', {
      method: 'POST',
      body: JSON.stringify({ confirmEmail }),
    });
  },
};

// ── Locations API ──

export const locations = {
  async nearby(lat, lng, radius) {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (radius) params.set('radius', String(radius));
    return apiFetch(`/locations/nearby?${params.toString()}`);
  },

  async directions(fromLat, fromLng, toLat, toLng, mode = 'driving') {
    const params = new URLSearchParams({
      fromLat: String(fromLat),
      fromLng: String(fromLng),
      toLat: String(toLat),
      toLng: String(toLng),
      mode,
    });
    return apiFetch(`/locations/directions?${params.toString()}`);
  },
};

// ── Recipe API ──

export const recipes = {
  async search(query, householdSize, preferences) {
    return apiFetch('/recipes/search', {
      method: 'POST',
      body: JSON.stringify({ query, householdSize, preferences }),
    });
  },

  async askCookingAssistant(recipe, question, conversationHistory, context) {
    return apiFetch('/recipes/cooking/ask', {
      method: 'POST',
      body: JSON.stringify({ recipe, question, conversationHistory, context }),
    });
  },

  async askShoppingAssistant(recipe, question, conversationHistory) {
    return apiFetch('/recipes/shopping/ask', {
      method: 'POST',
      body: JSON.stringify({ recipe, question, conversationHistory }),
    });
  },

  async get(id) {
    return apiFetch(`/recipes/${id}`);
  },

  async history(page = 1, limit = 20) {
    return apiFetch(`/recipes/history?page=${page}&limit=${limit}`);
  },

  async toggleFavorite(id) {
    return apiFetch(`/recipes/${id}/save`, { method: 'POST' });
  },

  async favorites() {
    return apiFetch('/recipes/favorites/list');
  },

  async share(recipeId, toEmail) {
    return apiFetch('/recipes/share', {
      method: 'POST',
      body: JSON.stringify({ recipeId, toEmail }),
    });
  },
};

// ── Lexicon API ──

export const lexicon = {
  async suggest(query) {
    return apiFetch(`/lexicon/suggest?q=${encodeURIComponent(query)}`);
  },
};

export default { auth, recipes, lexicon, gdpr, locations };
