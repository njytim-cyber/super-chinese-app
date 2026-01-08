import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    INITIAL_GAME_STATE,
    calculateLevel,
    getLevelInfo,
} from '../types/game.types';
import type { GameState, XPEvent } from '../types/game.types';

interface GameStore extends GameState {
    // Actions
    addXP: (event: XPEvent) => { newLevel: boolean; levelInfo: ReturnType<typeof getLevelInfo> };
    updateStreak: () => void;
    unlockAchievement: (achievementId: string) => void;
    addCharacterLearned: (character: string) => void;
    completesLesson: (lessonId: string) => void;
    completeOnboarding: () => void;
    resetProgress: () => void;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_GAME_STATE,

            addXP: (event: XPEvent) => {
                const currentLevel = get().currentLevel;
                const newTotalXP = get().totalXP + event.amount;
                const newLevel = calculateLevel(newTotalXP);
                const levelInfo = getLevelInfo(newLevel);

                set({
                    totalXP: newTotalXP,
                    currentLevel: newLevel,
                    dailyGoalProgress: get().dailyGoalProgress + 1,
                });

                return {
                    newLevel: newLevel > currentLevel,
                    levelInfo,
                };
            },

            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { streak } = get();
                const lastDate = streak.lastPracticeDate;

                if (lastDate === today) {
                    // Already practiced today
                    return;
                }

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let newStreak = streak.currentStreak;

                if (lastDate === yesterdayStr) {
                    // Continuing streak
                    newStreak += 1;
                } else if (lastDate === null || lastDate < yesterdayStr) {
                    // Streak broken or first time
                    newStreak = 1;
                }

                set({
                    streak: {
                        ...streak,
                        currentStreak: newStreak,
                        longestStreak: Math.max(newStreak, streak.longestStreak),
                        lastPracticeDate: today,
                        streakFreezeUsedToday: false,
                    },
                });
            },

            unlockAchievement: (achievementId: string) => {
                const achievements = get().achievements;
                if (!achievements.includes(achievementId)) {
                    set({ achievements: [...achievements, achievementId] });
                }
            },

            addCharacterLearned: (character: string) => {
                const charactersLearned = get().charactersLearned;
                if (!charactersLearned.includes(character)) {
                    set({ charactersLearned: [...charactersLearned, character] });
                }
            },

            completesLesson: (lessonId: string) => {
                const lessonsCompleted = get().lessonsCompleted;
                if (!lessonsCompleted.includes(lessonId)) {
                    set({ lessonsCompleted: [...lessonsCompleted, lessonId] });
                }
            },

            completeOnboarding: () => {
                set({ hasCompletedOnboarding: true });
            },

            resetProgress: () => {
                set(INITIAL_GAME_STATE);
            },
        }),
        {
            name: 'super-chinese-game-storage',
        }
    )
);
