// ============================================
// Capacitor Native Bridge — iOS/Android setup
// ============================================

import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Scroll the currently focused input into view above the keyboard.
 * Double-rAF ensures the CSS transition (bottom: --keyboard-height)
 * has triggered a layout reflow before we measure positions.
 */
function scrollFocusedInputIntoView() {
  // Double requestAnimationFrame: first rAF queues after CSS applies,
  // second rAF queues after the layout reflow from the CSS change.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.activeElement;
      if (!el || !el.matches('input, textarea, select, [contenteditable]')) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

/**
 * Get current position using Capacitor Geolocation (native) or Web API (fallback).
 * Returns { latitude, longitude, accuracy }.
 */
export async function getCurrentPosition(options = {}) {
  const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000, ...options };

  if (isNative) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const pos = await Geolocation.getCurrentPosition(opts);
      return pos.coords;
    } catch (err) {
      console.warn('Capacitor Geolocation failed, trying Web API:', err.message);
    }
  }

  // Web fallback
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation stöds inte av denna enhet.'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      opts
    );
  });
}

/**
 * Check geolocation permission status (native only).
 * Returns 'granted' | 'denied' | 'prompt'.
 */
export async function checkLocationPermission() {
  if (!isNative) return 'prompt';
  try {
    const { Geolocation } = await import('@capacitor/geolocation');
    const status = await Geolocation.checkPermissions();
    return status.location;
  } catch {
    return 'prompt';
  }
}

export async function requestLocationPermission() {
  if (!isNative) return 'granted';
  try {
    const { Geolocation } = await import('@capacitor/geolocation');
    const status = await Geolocation.requestPermissions();
    return status.location;
  } catch {
    return 'denied';
  }
}

export async function initNativePlugins() {
  if (!isNative) return;

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    const { Keyboard } = await import('@capacitor/keyboard');

    // Hide splash after app is ready
    await SplashScreen.hide();

    // Light status bar (dark text on cream bg)
    if (platform === 'ios') {
      await StatusBar.setStyle({ style: Style.Light });
    }

    // Keyboard: shrink viewport and scroll focused input into view
    Keyboard.addListener('keyboardWillShow', (info) => {
      // Set keyboard height CSS var BEFORE adding class so CSS transition works
      document.documentElement.style.setProperty(
        '--keyboard-height', `${info.keyboardHeight}px`
      );
      document.body.classList.add('keyboard-open');
      // Wait for CSS transition + layout reflow, then scroll
      scrollFocusedInputIntoView();
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
      // Small delay before resetting height so closing transition is smooth
      setTimeout(() => {
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      }, 50);
    });

    // Handle tapping a different input while keyboard is already open
    document.addEventListener('focusin', (e) => {
      if (!document.body.classList.contains('keyboard-open')) return;
      if (!e.target.matches('input, textarea, select, [contenteditable]')) return;
      requestAnimationFrame(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  } catch (err) {
    console.warn('Native plugin init failed:', err.message);
  }
}
