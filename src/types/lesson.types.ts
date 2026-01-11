// =====================================================
// LESSON TYPES - Chinese learning content structure
// =====================================================

// Character difficulty levels
// Character difficulty levels
export type CharacterDifficulty = 'basic' | 'intermediate' | 'advanced' | 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6';

export type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Chinese character definition
export interface ChineseCharacter {
    character: string;       // The hanzi character
    pinyin: string;          // Pinyin with tone marks
    pinyinNumeric: string;   // Pinyin with tone numbers (e.g., "yi1")
    meaning: string;         // English meaning (default)
    meaningKey: string;      // i18n key for translations
    strokeCount: number;
    difficulty: CharacterDifficulty;
    radicals?: string[];
    examples?: CharacterExample[];
    audio?: string;          // Audio file path or URL
    strokeOrder?: string[];  // SVG paths or HanziWriter stroke data
    exampleSentences?: ExampleSentence[];  // Contextual usage examples
}

export interface ExampleSentence {
    chinese: string;
    pinyin: string;
    english: string;
    audioUrl?: string;
}

export interface CharacterExample {
    chinese: string;
    pinyin: string;
    meaningKey: string;
}

// Lesson structure
export interface Lesson {
    id: string;
    titleKey: string;        // i18n key
    descriptionKey: string;  // i18n key
    category: LessonCategory;
    difficulty: CharacterDifficulty;
    characters: ChineseCharacter[];
    xpReward: number;
    estimatedMinutes: number;
    prerequisites?: string[]; // Lesson IDs
    unlocked: boolean;
}

export type LessonCategory =
    | 'numbers'
    | 'greetings'
    | 'family'
    | 'food'
    | 'colors'
    | 'animals'
    | 'time'
    | 'weather'
    | 'travel'
    | 'business';

// User progress on a lesson
export interface LessonProgress {
    lessonId: string;
    startedAt: Date;
    completedAt?: Date;
    charactersCompleted: string[];
    currentCharacterIndex: number;
    attempts: number;
    perfectStrokes: number;
    totalStrokes: number;
    score: number; // 0-100
}

// Onboarding sequence characters
export const ONBOARDING_CHARACTERS: ChineseCharacter[] = [
    {
        character: '一',
        pinyin: 'yī',
        pinyinNumeric: 'yi1',
        meaning: 'one',
        meaningKey: 'characters.yi.meaning',
        strokeCount: 1,
        difficulty: 'basic',
    },
    {
        character: '二',
        pinyin: 'èr',
        pinyinNumeric: 'er4',
        meaning: 'two',
        meaningKey: 'characters.er.meaning',
        strokeCount: 2,
        difficulty: 'basic',
    },
    {
        character: '三',
        pinyin: 'sān',
        pinyinNumeric: 'san1',
        meaning: 'three',
        meaningKey: 'characters.san.meaning',
        strokeCount: 3,
        difficulty: 'basic',
    },
    {
        character: '十',
        pinyin: 'shí',
        pinyinNumeric: 'shi2',
        meaning: 'ten',
        meaningKey: 'characters.shi.meaning',
        strokeCount: 2,
        difficulty: 'basic',
    },
];
