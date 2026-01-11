/**
 * HSK Data Loader
 * Unified access to HSK 1-6 vocabulary with lazy loading support
 */

import type { ChineseCharacter, HSKLevel } from '../types/lesson.types';

// Lazy-load HSK data modules
const HSK_MODULES: Record<HSKLevel, () => Promise<{ default?: ChineseCharacter[]; HSK1_VOCABULARY?: ChineseCharacter[]; HSK2_VOCABULARY?: ChineseCharacter[]; HSK3_VOCABULARY?: ChineseCharacter[] }>> = {
    1: () => import('./hsk1').then(m => ({ HSK1_VOCABULARY: m.HSK1_VOCABULARY })),
    2: () => import('./hsk2').then(m => ({ HSK2_VOCABULARY: m.HSK2_VOCABULARY })),
    3: () => import('./hsk3').then(m => ({ HSK3_VOCABULARY: m.HSK3_VOCABULARY })),
    4: () => Promise.resolve({ default: [] }), // Placeholder
    5: () => Promise.resolve({ default: [] }), // Placeholder
    6: () => Promise.resolve({ default: [] }), // Placeholder
};

// Cache for loaded HSK data
const hskCache: Partial<Record<HSKLevel, ChineseCharacter[]>> = {};

/**
 * Get vocabulary for a specific HSK level
 */
export async function getHSKVocabulary(level: HSKLevel): Promise<ChineseCharacter[]> {
    if (hskCache[level]) {
        return hskCache[level]!;
    }

    const module = await HSK_MODULES[level]();
    const vocabulary = module.default || module.HSK1_VOCABULARY || module.HSK2_VOCABULARY || module.HSK3_VOCABULARY || [];
    hskCache[level] = vocabulary;
    return vocabulary;
}

/**
 * Get vocabulary for multiple HSK levels
 */
export async function getHSKVocabularyRange(startLevel: HSKLevel, endLevel: HSKLevel): Promise<ChineseCharacter[]> {
    const levels: HSKLevel[] = [];
    for (let i = startLevel; i <= endLevel; i++) {
        levels.push(i as HSKLevel);
    }

    const results = await Promise.all(levels.map(level => getHSKVocabulary(level)));
    return results.flat();
}

/**
 * Get a single character/word by ID from any HSK level
 */
export async function getWordById(id: string): Promise<ChineseCharacter | undefined> {
    // Search through all levels (could be optimized with an index)
    for (let level = 1; level <= 6; level++) {
        const vocab = await getHSKVocabulary(level as HSKLevel);
        const found = vocab.find(word => word.character === id);
        if (found) return found;
    }
    return undefined;
}

/**
 * HSK Level Metadata
 */
export const HSK_METADATA: Record<HSKLevel, { wordCount: number; charCount: number; focus: string[] }> = {
    1: { wordCount: 150, charCount: 174, focus: ['listening', 'reading'] },
    2: { wordCount: 150, charCount: 173, focus: ['listening', 'reading'] },
    3: { wordCount: 300, charCount: 270, focus: ['listening', 'reading', 'writing'] },
    4: { wordCount: 600, charCount: 447, focus: ['listening', 'reading', 'writing'] },
    5: { wordCount: 1300, charCount: 636, focus: ['listening', 'reading', 'writing'] },
    6: { wordCount: 2500, charCount: 663, focus: ['listening', 'reading', 'writing'] },
};

/**
 * Get the HSK level for a given word
 */
export function getHSKLevelForWord(difficulty: string): HSKLevel | null {
    const match = difficulty.match(/hsk(\d)/);
    if (match) {
        const level = parseInt(match[1]);
        if (level >= 1 && level <= 6) return level as HSKLevel;
    }
    return null;
}
