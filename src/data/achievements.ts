/**
 * Achievement System
 * Unlockable badges with celebratory animations
 */

export interface Achievement {
    id: string;
    icon: string;
    title: string;
    titleEn: string;
    description: string;
    requirement: number;
    type: 'words_learned' | 'streak' | 'practice_sessions' | 'accuracy' | 'combo';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
    // Words Learned
    {
        id: 'first_word',
        icon: '🌱',
        title: '萌芽',
        titleEn: 'First Sprout',
        description: 'Learn your first word',
        requirement: 1,
        type: 'words_learned',
        rarity: 'common'
    },
    {
        id: 'vocab_10',
        icon: '📚',
        title: '初学者',
        titleEn: 'Beginner',
        description: 'Learn 10 words',
        requirement: 10,
        type: 'words_learned',
        rarity: 'common'
    },
    {
        id: 'vocab_50',
        icon: '📖',
        title: '勤奋学生',
        titleEn: 'Diligent Student',
        description: 'Learn 50 words',
        requirement: 50,
        type: 'words_learned',
        rarity: 'common'
    },
    {
        id: 'vocab_100',
        icon: '🎓',
        title: '词汇达人',
        titleEn: 'Vocab Master',
        description: 'Learn 100 words',
        requirement: 100,
        type: 'words_learned',
        rarity: 'rare'
    },
    {
        id: 'vocab_500',
        icon: '👨‍🎓',
        title: 'HSK 1 通关',
        titleEn: 'HSK 1 Complete',
        description: 'Learn 500 words (HSK 1)',
        requirement: 500,
        type: 'words_learned',
        rarity: 'epic'
    },
    {
        id: 'vocab_1000',
        icon: '🏆',
        title: '千词王',
        titleEn: 'Thousand Words',
        description: 'Learn 1000 words',
        requirement: 1000,
        type: 'words_learned',
        rarity: 'legendary'
    },

    // Streaks
    {
        id: 'streak_3',
        icon: '🔥',
        title: '三日连胜',
        titleEn: '3-Day Streak',
        description: 'Maintain a 3-day streak',
        requirement: 3,
        type: 'streak',
        rarity: 'common'
    },
    {
        id: 'streak_7',
        icon: '⚡',
        title: '周周学习',
        titleEn: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        requirement: 7,
        type: 'streak',
        rarity: 'rare'
    },
    {
        id: 'streak_30',
        icon: '💎',
        title: '月度大师',
        titleEn: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        requirement: 30,
        type: 'streak',
        rarity: 'epic'
    },
    {
        id: 'streak_100',
        icon: '👑',
        title: '百日王者',
        titleEn: 'Centurion',
        description: 'Maintain a 100-day streak',
        requirement: 100,
        type: 'streak',
        rarity: 'legendary'
    },

    // Combos
    {
        id: 'combo_5',
        icon: '✨',
        title: '小连击',
        titleEn: 'Mini Combo',
        description: 'Get a 5x combo',
        requirement: 5,
        type: 'combo',
        rarity: 'common'
    },
    {
        id: 'combo_10',
        icon: '💫',
        title: '连击高手',
        titleEn: 'Combo Pro',
        description: 'Get a 10x combo',
        requirement: 10,
        type: 'combo',
        rarity: 'rare'
    },
    {
        id: 'combo_20',
        icon: '🌟',
        title: '完美连击',
        titleEn: 'Perfect Run',
        description: 'Get a 20x combo',
        requirement: 20,
        type: 'combo',
        rarity: 'epic'
    },

    // Accuracy
    {
        id: 'perfect_session',
        icon: '💯',
        title: '完美练习',
        titleEn: 'Perfect Session',
        description: 'Complete a practice session with 100% accuracy',
        requirement: 100,
        type: 'accuracy',
        rarity: 'rare'
    },
];

export const RARITY_COLORS = {
    common: { bg: 'rgba(158, 158, 158, 0.2)', border: '#9e9e9e', glow: 'rgba(158, 158, 158, 0.5)' },
    rare: { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196f3', glow: 'rgba(33, 150, 243, 0.5)' },
    epic: { bg: 'rgba(156, 39, 176, 0.2)', border: '#9c27b0', glow: 'rgba(156, 39, 176, 0.5)' },
    legendary: { bg: 'rgba(255, 215, 0, 0.2)', border: '#ffd700', glow: 'rgba(255, 215, 0, 0.5)' },
};

export default ACHIEVEMENTS;
