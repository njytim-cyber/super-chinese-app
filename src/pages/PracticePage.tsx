/**
 * Practice Page - HSK Practice Mode Selector
 * Gateway to Listening, Reading, and Writing practice modes
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListeningPractice, ReadingPractice, WritingPractice } from '../components/practice';
import { SRSDashboard, ToneVisualizer } from '../components/learning';
import { HSK1_WORDS } from '../data/hsk1_enriched';
import { HSK2_WORDS } from '../data/hsk2_enriched';
import { HSK3_WORDS } from '../data/hsk3_enriched';
import './PracticePage.css';

// HSK Item type
interface HSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

type PracticeMode = 'select' | 'listening' | 'reading' | 'writing' | 'tones';

const PRACTICE_MODES = [
    {
        id: 'listening',
        icon: '🎧',
        title: '听力练习',
        subtitle: 'Listening',
        description: '听音选词 · Audio Matching',
        color: '#667eea',
        available: true
    },
    {
        id: 'reading',
        icon: '📖',
        title: '阅读练习',
        subtitle: 'Reading',
        description: '词义匹配 · Word Matching',
        color: '#48bb78',
        available: true
    },
    {
        id: 'writing',
        icon: '✍️',
        title: '写作练习',
        subtitle: 'Writing',
        description: '句子重组 · Sentence Building',
        color: '#ed8936',
        available: true
    },
    {
        id: 'tones',
        icon: '🎵',
        title: '声调练习',
        subtitle: 'Tones',
        description: '音调识别 · Pitch Training',
        color: '#e91e63',
        available: true
    }
];

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];

const getWordsForLevel = (level: number): HSKItem[] => {
    switch (level) {
        case 1: return HSK1_WORDS;
        case 2: return HSK2_WORDS;
        case 3: return HSK3_WORDS;
        default: return HSK1_WORDS; // Fallback for levels 4-6
    }
};

export const PracticePage: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<PracticeMode>('select');
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [words, setWords] = useState<HSKItem[]>([]);

    useEffect(() => {
        const levelWords = getWordsForLevel(selectedLevel);
        // Filter to only words with pinyin and meaning
        const enrichedWords = levelWords.filter(w => w.pinyin && w.meaning);
        setWords(enrichedWords);
    }, [selectedLevel]);

    const handleModeSelect = (modeId: string) => {
        setMode(modeId as PracticeMode);
    };

    const handleComplete = (stats: { correct: number; incorrect: number; totalTime: number; xpEarned: number }) => {
        console.log('Practice complete:', stats);
        setMode('select');
    };

    // Render practice mode
    if (mode === 'listening') {
        return (
            <ListeningPractice
                words={words}
                level={selectedLevel}
                onComplete={handleComplete}
            />
        );
    }

    if (mode === 'reading') {
        return (
            <ReadingPractice
                words={words}
                level={selectedLevel}
                onComplete={handleComplete}
            />
        );
    }

    if (mode === 'writing') {
        return (
            <WritingPractice
                words={words}
                level={selectedLevel}
                onComplete={handleComplete}
            />
        );
    }

    if (mode === 'tones') {
        // Get a random word with pinyin for tone practice
        const randomWord = words[Math.floor(Math.random() * words.length)];
        return (
            <div className="practice-page">
                <div className="practice-page-header">
                    <button className="back-btn" onClick={() => setMode('select')}>←</button>
                    <h1>声调练习</h1>
                    <div className="header-spacer" />
                </div>
                <div style={{ padding: '1rem' }}>
                    {randomWord?.pinyin && (
                        <ToneVisualizer
                            targetPinyin={randomWord.pinyin.split(' ')[0]}
                            onResult={(success, accuracy) => {
                                console.log('Tone result:', success, accuracy);
                            }}
                        />
                    )}
                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        Word: {randomWord?.character}
                    </p>
                    <button
                        onClick={() => setMode('tones')}
                        style={{
                            display: 'block',
                            margin: '1rem auto 0',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Next Word
                    </button>
                </div>
            </div>
        );
    }

    // Mode selector
    return (
        <div className="practice-page">
            {/* Header */}
            <div className="practice-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h1>练习模式</h1>
                <div className="header-spacer" />
            </div>

            {/* Level Selector */}
            <div className="level-selector">
                <span className="level-label">选择等级</span>
                <div className="level-pills">
                    {HSK_LEVELS.map(level => (
                        <button
                            key={level}
                            className={`level-pill ${selectedLevel === level ? 'active' : ''}`}
                            onClick={() => setSelectedLevel(level)}
                        >
                            HSK {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Word count indicator */}
            <div className="word-count">
                <span className="count">{words.length}</span>
                <span className="label">可用词汇</span>
            </div>

            {/* Mode cards */}
            <div className="mode-grid">
                {PRACTICE_MODES.map((modeItem, idx) => (
                    <motion.button
                        key={modeItem.id}
                        className={`mode-card ${!modeItem.available ? 'disabled' : ''}`}
                        onClick={() => modeItem.available && handleModeSelect(modeItem.id)}
                        disabled={!modeItem.available}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={modeItem.available ? { scale: 1.02 } : {}}
                        whileTap={modeItem.available ? { scale: 0.98 } : {}}
                        style={{ '--mode-color': modeItem.color } as React.CSSProperties}
                    >
                        <span className="mode-icon">{modeItem.icon}</span>
                        <div className="mode-info">
                            <span className="mode-title">{modeItem.title}</span>
                            <span className="mode-subtitle">{modeItem.subtitle}</span>
                        </div>
                        <span className="mode-description">{modeItem.description}</span>
                        {!modeItem.available && (
                            <span className="coming-soon">Coming Soon</span>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* SRS Dashboard */}
            <SRSDashboard targetLevel={selectedLevel} compact />
        </div>
    );
};

export default PracticePage;
