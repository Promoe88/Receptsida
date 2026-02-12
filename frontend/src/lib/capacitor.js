// ============================================
// Capacitor Native Bridge — iOS/Android setup
// ============================================

import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Scroll the currently focused input into view above the keyboard.
 * Uses a short delay so the WebView has resized first.
 */
function scrollFocusedInputIntoView() {
  requestAnimationFrame(() => {
    const el = document.activeElement;
    if (!el || !el.matches('input, textarea, select, [contenteditable]')) return;

    // Smooth scroll so the input sits comfortably in view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
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

    // Keyboard: make focused input visible above keyboard
    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.classList.add('keyboard-open');
      document.documentElement.style.setProperty(
        '--keyboard-height', `${info.keyboardHeight}px`
      );
      // Wait for viewport resize then scroll input into view
      setTimeout(scrollFocusedInputIntoView, 50);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    });

    // Also handle focus events — user may tap another input while keyboard is open
    document.addEventListener('focusin', (e) => {
      if (!document.body.classList.contains('keyboard-open')) return;
      if (!e.target.matches('input, textarea, select, [contenteditable]')) return;
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  } catch (err) {
    console.warn('Native plugin init failed:', err.message);
  }
}
