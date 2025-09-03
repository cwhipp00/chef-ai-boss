import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dfbbc0ec736b4de4addf49f75b7c36c5',
  appName: 'chef-ai-boss',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://dfbbc0ec-736b-4de4-addf-49f75b7c36c5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f97316',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      spinnerColor: '#ffffff'
    }
  }
};

export default config;