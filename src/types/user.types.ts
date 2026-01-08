// =====================================================
// USER TYPES - User preferences and settings
// =====================================================

export type SupportedLanguage = 'en' | 'fr' | 'zh' | 'es' | 'de' | 'ja' | 'ko';

export interface UserPreferences {
    language: SupportedLanguage;
    theme: 'light' | 'dark' | 'system';
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
    dailyReminderTime?: string; // HH:mm format
    showPinyin: boolean;
    strokeHintLevel: 'none' | 'outline' | 'animated';
    zenMode: boolean; // Disable streaks/penalties for neurodivergent accessibility
    audioSpeed: number; // 0.5-2.0 playback speed
    learningMode: 'gamified' | 'zen' | 'focus'; // Learning style preference
}

export interface UserProfile {
    id: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
    createdAt: Date;
    lastActiveAt: Date;
    preferences: UserPreferences;
    isPremium: boolean;
    premiumExpiresAt?: Date;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
    language: 'en',
    theme: 'light',
    soundEnabled: true,
    hapticEnabled: true,
    notificationsEnabled: true,
    showPinyin: true,
    strokeHintLevel: 'animated',
    zenMode: false,
    audioSpeed: 1.0,
    learningMode: 'gamified',
};

// Language metadata for the language selector
export interface LanguageOption {
    code: SupportedLanguage;
    name: string;        // Name in that language
    englishName: string; // Name in English
    flag: string;        // Emoji flag
    isRTL: boolean;      // Right-to-left
    available: boolean;  // Currently implemented
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: 'en', name: 'English', englishName: 'English', flag: '🇺🇸', isRTL: false, available: true },
    { code: 'fr', name: 'Français', englishName: 'French', flag: '🇫🇷', isRTL: false, available: true },
    { code: 'zh', name: '中文', englishName: 'Chinese', flag: '🇨🇳', isRTL: false, available: false },
    { code: 'es', name: 'Español', englishName: 'Spanish', flag: '🇪🇸', isRTL: false, available: false },
    { code: 'de', name: 'Deutsch', englishName: 'German', flag: '🇩🇪', isRTL: false, available: false },
    { code: 'ja', name: '日本語', englishName: 'Japanese', flag: '🇯🇵', isRTL: false, available: false },
    { code: 'ko', name: '한국어', englishName: 'Korean', flag: '🇰🇷', isRTL: false, available: false },
];
