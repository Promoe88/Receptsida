import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matkompass.app',
  appName: 'MatKompass',
  webDir: 'out',
  server: {
    // Production API — all requests go directly to Railway backend
    url: undefined, // Uses local files (static export)
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      'receptsida-production.up.railway.app',
    ],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#FDFBF7', // cream-100
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT', // dark text on light bg
      backgroundColor: '#FDFBF7',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    scheme: 'MatKompass',
  },
};

export default config;
