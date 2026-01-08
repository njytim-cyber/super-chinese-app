import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_USER_PREFERENCES } from '../types/user.types';
import type { UserPreferences, SupportedLanguage } from '../types/user.types';
import { changeLanguage } from '../i18n';

interface UserStore {
    preferences: UserPreferences;
    isAuthenticated: boolean;
    profile: {
        displayName: string;
        avatar: string;
    };

    // Actions
    setDisplayName: (name: string) => void;
    setAvatar: (avatar: string) => void;
    setLanguage: (language: SupportedLanguage) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleSound: () => void;
    toggleHaptic: () => void;
    toggleNotifications: () => void;
    togglePinyin: () => void;
    toggleZenMode: () => void;
    setAudioSpeed: (speed: number) => void;
    setLearningMode: (mode: 'gamified' | 'zen' | 'focus') => void;
    setStrokeHintLevel: (level: 'none' | 'outline' | 'animated') => void;
    updatePreferences: (partial: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            preferences: DEFAULT_USER_PREFERENCES,
            isAuthenticated: false,
            profile: {
                displayName: 'Learner',
                avatar: '🐼'
            },

            setDisplayName: (name: string) => {
                set(state => ({
                    profile: { ...state.profile, displayName: name }
                }));
            },

            setAvatar: (avatar: string) => {
                set(state => ({
                    profile: { ...state.profile, avatar }
                }));
            },

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

            toggleZenMode: () => {
                const newZenMode = !get().preferences.zenMode;
                set({
                    preferences: {
                        ...get().preferences,
                        zenMode: newZenMode,
                        // Auto-switch learning mode when Zen Mode toggled
                        learningMode: newZenMode ? 'zen' : 'gamified'
                    },
                });
            },

            setAudioSpeed: (speed: number) => {
                // Clamp between 0.5 and 2.0
                const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
                set({
                    preferences: { ...get().preferences, audioSpeed: clampedSpeed },
                });
            },

            setLearningMode: (mode: 'gamified' | 'zen' | 'focus') => {
                set({
                    preferences: {
                        ...get().preferences,
                        learningMode: mode,
                        // Auto-enable zenMode for zen learning mode
                        zenMode: mode === 'zen'
                    },
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
