// ============================================
// Capacitor Native Bridge — iOS/Android setup
// ============================================

import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

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

    // Keyboard: scroll input into view
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  } catch (err) {
    console.warn('Native plugin init failed:', err.message);
  }
}
