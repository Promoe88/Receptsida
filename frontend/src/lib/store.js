// ============================================
// Auth Store — Zustand global state
// ============================================

import { create } from 'zustand';
import { auth as authApi } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isNewUser: false,

  // Initialize from stored refresh token
  init: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.initFromStorage();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.login(email, password);
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  register: async (email, password, name, householdSize) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.register(email, password, name, householdSize);
      set({ user, loading: false, isNewUser: true });
      return user;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  googleLogin: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const { user, isNewUser } = await authApi.googleLogin(idToken);
      set({ user, loading: false, isNewUser });
      return { user, isNewUser };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  appleLogin: async (identityToken, authorizationCode, fullName) => {
    set({ loading: true, error: null });
    try {
      const { user, isNewUser } = await authApi.appleLogin(identityToken, authorizationCode, fullName);
      set({ user, loading: false, isNewUser });
      return { user, isNewUser };
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  completeOnboarding: async () => {
    try {
      await authApi.completeOnboarding();
      set((state) => ({
        user: state.user ? { ...state.user, onboardingDone: true } : null,
        isNewUser: false,
      }));
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, error: null, isNewUser: false });
    }
  },

  clearError: () => set({ error: null }),

  isLoggedIn: () => !!get().user,
  isPremium: () => {
    const user = get().user;
    return user?.plan === 'PREMIUM' || user?.plan === 'ADMIN';
  },
  needsOnboarding: () => {
    const user = get().user;
    return user && !user.onboardingDone;
  },
}));
