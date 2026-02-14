import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matkompass.app',
  appName: 'Nisse',
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
      backgroundColor: '#EBEDF0', // soft grey gradient top
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT', // dark text on light bg
      backgroundColor: '#EBEDF0',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    scheme: 'Nisse',
  },
};

export default config;
