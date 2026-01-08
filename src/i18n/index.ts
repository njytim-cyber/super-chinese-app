import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, fr } from './locales';

// Detect browser language or use stored preference
const getDefaultLanguage = (): string => {
    // Check localStorage first
    const stored = localStorage.getItem('super-chinese-language');
    if (stored && ['en', 'fr', 'zh', 'es', 'de', 'ja', 'ko'].includes(stored)) {
        return stored;
    }

    return 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
        },
        lng: getDefaultLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes
        },
        react: {
            useSuspense: false,
        },
    });

// Function to change language and persist choice
export const changeLanguage = (lng: string) => {
    localStorage.setItem('super-chinese-language', lng);
    i18n.changeLanguage(lng);
};

export default i18n;
