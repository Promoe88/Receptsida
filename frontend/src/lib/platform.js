// ============================================
// Platform Detection — Web vs Native App
// ============================================
// Build-time: NEXT_PUBLIC_APP_MODE=native (set in build:ios)
// Runtime:    Capacitor.isNativePlatform()
// ============================================

import { isNative, platform } from './capacitor';

const isAppBuild = process.env.NEXT_PUBLIC_APP_MODE === 'native';

/** True when running inside Capacitor (iOS/Android) or built for native */
export const isApp = isAppBuild || isNative;

/** True when running as a regular website */
export const isWeb = !isApp;

/** 'ios' | 'android' | 'web' */
export const appPlatform = isApp ? platform : 'web';
