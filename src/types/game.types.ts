// =====================================================
// GAME TYPES - Core gamification system definitions
// =====================================================

// XP and Leveling System
export interface XPEvent {
    type: 'character_complete' | 'lesson_complete' | 'streak_bonus' | 'achievement' | 'daily_goal';
    amount: number;
    timestamp: Date;
    description?: string;
}

export interface LevelInfo {
    level: number;
    title: string;
    minXP: number;
    maxXP: number;
    icon: string;
}

// Level thresholds and titles
export const LEVELS: LevelInfo[] = [
    { level: 1, title: '初学者', minXP: 0, maxXP: 100, icon: '🌱' },        // Beginner
    { level: 2, title: '学徒', minXP: 100, maxXP: 300, icon: '📚' },       // Apprentice
    { level: 3, title: '学生', minXP: 300, maxXP: 600, icon: '✏️' },       // Student
    { level: 4, title: '进步者', minXP: 600, maxXP: 1000, icon: '📖' },    // Progressor
    { level: 5, title: '探索者', minXP: 1000, maxXP: 1500, icon: '🔍' },   // Explorer
    { level: 6, title: '学者', minXP: 1500, maxXP: 2200, icon: '🎓' },     // Scholar
    { level: 7, title: '精通者', minXP: 2200, maxXP: 3000, icon: '⭐' },   // Proficient
    { level: 8, title: '专家', minXP: 3000, maxXP: 4000, icon: '💫' },     // Expert
    { level: 9, title: '大师', minXP: 4000, maxXP: 5500, icon: '🏆' },     // Master
    { level: 10, title: '宗师', minXP: 5500, maxXP: Infinity, icon: '👑' }, // Grandmaster
];

// Streak System
export interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: string | null; // ISO date string
    streakFreezeAvailable: boolean;
    streakFreezeUsedToday: boolean;
}

// Achievement System
export type AchievementCategory = 'learning' | 'streak' | 'mastery' | 'social' | 'special';

export interface Achievement {
    id: string;
    name: string;
    nameKey: string; // i18n key
    description: string;
    descriptionKey: string; // i18n key
    icon: string;
    category: AchievementCategory;
    xpReward: number;
    requirement: AchievementRequirement;
    unlockedAt?: Date;
    progress?: number;
    maxProgress?: number;
}

export interface AchievementRequirement {
    type: 'characters_learned' | 'streak_days' | 'total_xp' | 'lessons_completed' | 'perfect_scores' | 'custom';
    value: number;
}

// Predefined Achievements
export const ACHIEVEMENTS: Achievement[] = [
    // Learning Achievements
    {
        id: 'first_character',
        name: 'First Steps',
        nameKey: 'achievements.first_character.name',
        description: 'Write your first Chinese character',
        descriptionKey: 'achievements.first_character.description',
        icon: '✍️',
        category: 'learning',
        xpReward: 10,
        requirement: { type: 'characters_learned', value: 1 },
    },
    {
        id: 'ten_characters',
        name: 'Getting Started',
        nameKey: 'achievements.ten_characters.name',
        description: 'Learn 10 characters',
        descriptionKey: 'achievements.ten_characters.description',
        icon: '📝',
        category: 'learning',
        xpReward: 50,
        requirement: { type: 'characters_learned', value: 10 },
    },
    {
        id: 'hundred_characters',
        name: 'Century Club',
        nameKey: 'achievements.hundred_characters.name',
        description: 'Learn 100 characters',
        descriptionKey: 'achievements.hundred_characters.description',
        icon: '💯',
        category: 'learning',
        xpReward: 200,
        requirement: { type: 'characters_learned', value: 100 },
    },
    // Streak Achievements
    {
        id: 'streak_3',
        name: 'On Fire',
        nameKey: 'achievements.streak_3.name',
        description: 'Achieve a 3-day streak',
        descriptionKey: 'achievements.streak_3.description',
        icon: '🔥',
        category: 'streak',
        xpReward: 25,
        requirement: { type: 'streak_days', value: 3 },
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        nameKey: 'achievements.streak_7.name',
        description: 'Achieve a 7-day streak',
        descriptionKey: 'achievements.streak_7.description',
        icon: '⚡',
        category: 'streak',
        xpReward: 75,
        requirement: { type: 'streak_days', value: 7 },
    },
    {
        id: 'streak_30',
        name: 'Monthly Master',
        nameKey: 'achievements.streak_30.name',
        description: 'Achieve a 30-day streak',
        descriptionKey: 'achievements.streak_30.description',
        icon: '🌟',
        category: 'streak',
        xpReward: 300,
        requirement: { type: 'streak_days', value: 30 },
    },
];

// Game State
export interface GameState {
    totalXP: number;
    currentLevel: number;
    streak: StreakInfo;
    achievements: string[]; // IDs of unlocked achievements
    charactersLearned: string[];
    lessonsCompleted: string[];
    dailyGoalProgress: number;
    dailyGoalTarget: number;
    hasCompletedOnboarding: boolean;
}

// Initial Game State
export const INITIAL_GAME_STATE: GameState = {
    totalXP: 0,
    currentLevel: 1,
    streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
        streakFreezeAvailable: false,
        streakFreezeUsedToday: false,
    },
    achievements: [],
    charactersLearned: [],
    lessonsCompleted: [],
    dailyGoalProgress: 0,
    dailyGoalTarget: 10,
    hasCompletedOnboarding: false,
};

// Utility Functions
export function calculateLevel(totalXP: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVELS[i].minXP) {
            return LEVELS[i].level;
        }
    }
    return 1;
}

export function getLevelInfo(level: number): LevelInfo {
    return LEVELS[level - 1] || LEVELS[0];
}

export function getXPToNextLevel(totalXP: number): { current: number; required: number; percentage: number } {
    const level = calculateLevel(totalXP);
    const levelInfo = getLevelInfo(level);
    const nextLevelInfo = getLevelInfo(level + 1);

    if (level >= LEVELS.length) {
        return { current: 0, required: 0, percentage: 100 };
    }

    const current = totalXP - levelInfo.minXP;
    const required = nextLevelInfo.minXP - levelInfo.minXP;
    const percentage = Math.min((current / required) * 100, 100);

    return { current, required, percentage };
}
