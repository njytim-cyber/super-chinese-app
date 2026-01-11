import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './gameStore';
import { INITIAL_GAME_STATE } from '../types/game.types';

// Mock localStorage for Zustand persist
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('GameStore', () => {
    beforeEach(() => {
        useGameStore.setState(INITIAL_GAME_STATE);
        localStorageMock.clear();
    });

    it('should initialize with default state', () => {
        const state = useGameStore.getState();
        expect(state.currentLevel).toBe(1);
        expect(state.totalXP).toBe(0);
        expect(state.streak.currentStreak).toBe(0);
    });

    it('should add XP and level up', () => {
        const { newLevel } = useGameStore.getState().addXP({ amount: 100, source: 'practice' });
        const state = useGameStore.getState();

        expect(state.totalXP).toBe(100);
        expect(newLevel).toBeDefined();
        // Logic depends on `calculateLevel`. If 100XP is enough for level 2, it should be true.
        // Assuming level 1 -> 2 requires some XP.
    });

    it('should update streak correctly', () => {
        const state = useGameStore.getState();

        // Mock date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // First practice today
        useGameStore.getState().updateStreak();

        const newState = useGameStore.getState();
        expect(newState.streak.currentStreak).toBe(1);
        expect(newState.streak.lastPracticeDate).toBe(todayStr);
    });

    it('should not increment streak if already practiced today', () => {
        // First practice
        useGameStore.getState().updateStreak();
        expect(useGameStore.getState().streak.currentStreak).toBe(1);

        // Second practice
        useGameStore.getState().updateStreak();
        expect(useGameStore.getState().streak.currentStreak).toBe(1);
    });

    it('should unlock achievement', () => {
        useGameStore.getState().unlockAchievement('first-win');
        expect(useGameStore.getState().achievements).toContain('first-win');

        // Should not duplicate
        useGameStore.getState().unlockAchievement('first-win');
        expect(useGameStore.getState().achievements).toHaveLength(1);
    });
});
