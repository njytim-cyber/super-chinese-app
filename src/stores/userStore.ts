import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_USER_PREFERENCES } from '../types/user.types';
import type { UserPreferences, SupportedLanguage } from '../types/user.types';
import { changeLanguage } from '../i18n';

interface UserStore {
    preferences: UserPreferences;
    isAuthenticated: boolean;

    // Actions
    setLanguage: (language: SupportedLanguage) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleSound: () => void;
    toggleHaptic: () => void;
    toggleNotifications: () => void;
    togglePinyin: () => void;
    setStrokeHintLevel: (level: 'none' | 'outline' | 'animated') => void;
    updatePreferences: (partial: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            preferences: DEFAULT_USER_PREFERENCES,
            isAuthenticated: false,

            setLanguage: (language: SupportedLanguage) => {
                changeLanguage(language);
                set({
                    preferences: { ...get().preferences, language },
                });
            },

            setTheme: (theme: 'light' | 'dark' | 'system') => {
                set({
                    preferences: { ...get().preferences, theme },
                });
                // Apply theme to document
                if (theme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', theme);
                }
            },

            toggleSound: () => {
                set({
                    preferences: { ...get().preferences, soundEnabled: !get().preferences.soundEnabled },
                });
            },

            toggleHaptic: () => {
                set({
                    preferences: { ...get().preferences, hapticEnabled: !get().preferences.hapticEnabled },
                });
            },

            toggleNotifications: () => {
                set({
                    preferences: {
                        ...get().preferences,
                        notificationsEnabled: !get().preferences.notificationsEnabled,
                    },
                });
            },

            togglePinyin: () => {
                set({
                    preferences: { ...get().preferences, showPinyin: !get().preferences.showPinyin },
                });
            },

            setStrokeHintLevel: (level: 'none' | 'outline' | 'animated') => {
                set({
                    preferences: { ...get().preferences, strokeHintLevel: level },
                });
            },

            updatePreferences: (partial: Partial<UserPreferences>) => {
                set({
                    preferences: { ...get().preferences, ...partial },
                });
            },

            resetPreferences: () => {
                set({ preferences: DEFAULT_USER_PREFERENCES });
            },
        }),
        {
            name: 'super-chinese-user-storage',
        }
    )
);
