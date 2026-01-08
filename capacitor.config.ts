import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.superchineseapp.app',
    appName: 'Super Chinese',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#1a1a2e',
            showSpinner: false,
        },
    },
};

export default config;
