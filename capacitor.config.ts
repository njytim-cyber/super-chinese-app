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
            androidSpinnerStyle: 'small',
            iosSpinnerStyle: 'small',
        },
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#1a1a2e',
        },
        Keyboard: {
            resize: 'body',
            resizeOnFullScreen: true,
        },
    },
    ios: {
        contentInset: 'automatic',
        backgroundColor: '#1a1a2e',
    },
    android: {
        backgroundColor: '#1a1a2e',
    },
};

export default config;

