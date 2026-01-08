/**
 * Graded Reader Page
 * Interactive reader for HSK 4-6 bridge content
 * With word-by-word popup definitions and progress tracking
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GRADED_STORIES, GradedStory, VocabItem } from '../data/gradedReaders';
import { speakChinese } from '../utils/audio';
import './GradedReaderPage.css';

type ViewMode = 'library' | 'reading';

export const GradedReaderPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('library');
    const [selectedStory, setSelectedStory] = useState<GradedStory | null>(null);
    const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [currentParagraph, setCurrentParagraph] = useState(0);
    const [readProgress, setReadProgress] = useState(0);

    const getLevelColor = (level: number) => {
        switch (level) {
            case 4: return '#48bb78';
            case 5: return '#667eea';
            case 6: return '#ed8936';
            default: return '#667eea';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'daily_life': return '☕';
            case 'travel': return '🌏';
            case 'culture': return '🏮';
            case 'tech': return '💻';
            case 'history': return '📜';
            case 'dialogue': return '💬';
            default: return '📖';
        }
    };

    const handleSelectStory = (story: GradedStory) => {
        setSelectedStory(story);
        setViewMode('reading');
        setCurrentParagraph(0);
        setReadProgress(0);
        setShowTranslation(false);
    };

    const handleWordClick = useCallback((word: string) => {
        if (!selectedStory) return;

        // Find word in vocabulary
        const vocab = selectedStory.vocabulary.find(v =>
            word.includes(v.word) || v.word.includes(word)
        );

        if (vocab) {
            setSelectedWord(vocab);
            speakChinese(vocab.word);
        }
    }, [selectedStory]);

    const handleNextParagraph = () => {
        if (!selectedStory) return;

        if (currentParagraph < selectedStory.content.length - 1) {
            setCurrentParagraph(prev => prev + 1);
            setReadProgress(((currentParagraph + 2) / selectedStory.content.length) * 100);
        }
    };

    const handlePrevParagraph = () => {
        if (currentParagraph > 0) {
            setCurrentParagraph(prev => prev - 1);
        }
    };

    // Render text with clickable vocab words
    const renderInteractiveText = (text: string) => {
        if (!selectedStory) return text;

        const parts: React.ReactNode[] = [];
        const lastIndex = 0;
        const words = [...selectedStory.vocabulary].sort((a, b) => b.word.length - a.word.length);

        // Simple approach: split by vocab words
        let remaining = text;
        const keyCounter = 0;

        for (const vocabItem of words) {
            const regex = new RegExp(vocabItem.word, 'g');
            remaining = remaining.replace(regex, `|||${vocabItem.word}|||`);
        }

        const segments = remaining.split('|||');

        return segments.map((segment, idx) => {
            const vocab = words.find(v => v.word === segment);
            if (vocab) {
                return (
                    <span
                        key={idx}
                        className={`vocab-highlight ${selectedWord?.word === segment ? 'active' : ''}`}
                        onClick={() => handleWordClick(segment)}
                    >
                        {segment}
                    </span>
                );
            }
            return <span key={idx}>{segment}</span>;
        });
    };

    // Library view
    if (viewMode === 'library') {
        const storyGroups = {
            4: GRADED_STORIES.filter(s => s.level === 4),
            5: GRADED_STORIES.filter(s => s.level === 5),
            6: GRADED_STORIES.filter(s => s.level === 6),
        };

        return (
            <div className="graded-reader-page">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h1>📚 分级阅读</h1>
                    <div className="header-spacer" />
                </header>

                <p className="page-description">
                    专为 HSK 4-6 学习者设计的分级读物，帮助突破中级瓶颈
                </p>

                {[4, 5, 6].map(level => (
                    <div key={level} className="level-section">
                        <h2 className="level-header" style={{ color: getLevelColor(level) }}>
                            HSK {level}
                            <span className="story-count">({storyGroups[level as 4 | 5 | 6].length} 篇)</span>
                        </h2>

                        <div className="story-list">
                            {storyGroups[level as 4 | 5 | 6].map((story, idx) => (
                                <motion.button
                                    key={story.id}
                                    className="story-card"
                                    onClick={() => handleSelectStory(story)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ '--level-color': getLevelColor(level) } as React.CSSProperties}
                                >
                                    <span className="story-icon">{getCategoryIcon(story.category)}</span>
                                    <div className="story-info">
                                        <span className="story-title">{story.title}</span>
                                        <span className="story-title-en">{story.titleEn}</span>
                                        <div className="story-meta">
                                            <span>{story.wordCount} 字</span>
                                            <span>·</span>
                                            <span>{story.estimatedMinutes} 分钟</span>
                                        </div>
                                    </div>
                                    <span className="story-arrow">→</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Reading view
    if (viewMode === 'reading' && selectedStory) {
        const paragraph = selectedStory.content[currentParagraph];
        const isLastParagraph = currentParagraph === selectedStory.content.length - 1;
        const isFirstParagraph = currentParagraph === 0;

        return (
            <div className="graded-reader-page reading-mode">
                <header className="page-header">
                    <button className="back-btn" onClick={() => setViewMode('library')}>←</button>
                    <h1>{selectedStory.title}</h1>
                    <span
                        className="level-badge"
                        style={{ background: getLevelColor(selectedStory.level) }}
                    >
                        HSK {selectedStory.level}
                    </span>
                </header>

                {/* Progress bar */}
                <div className="reading-progress">
                    <div
                        className="progress-fill"
                        style={{ width: `${readProgress}%` }}
                    />
                    <span className="progress-text">
                        {currentParagraph + 1} / {selectedStory.content.length}
                    </span>
                </div>

                {/* Reading content */}
                <div className="reading-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentParagraph}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="paragraph-container"
                        >
                            <p className="chinese-text">
                                {renderInteractiveText(paragraph.text)}
                            </p>

                            {showTranslation && paragraph.translation && (
                                <motion.p
                                    className="translation-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {paragraph.translation}
                                </motion.p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Word popup */}
                <AnimatePresence>
                    {selectedWord && (
                        <motion.div
                            className="vocab-popup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <button
                                className="popup-close"
                                onClick={() => setSelectedWord(null)}
                            >
                                ×
                            </button>
                            <div className="popup-content">
                                <span className="popup-word">{selectedWord.word}</span>
                                <span className="popup-pinyin">{selectedWord.pinyin}</span>
                                <span className="popup-meaning">{selectedWord.meaning}</span>
                                <span className="popup-level">HSK {selectedWord.level}</span>
                            </div>
                            <button
                                className="popup-speak"
                                onClick={() => speakChinese(selectedWord.word)}
                            >
                                🔊 播放
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="reading-controls">
                    <button
                        className="control-btn"
                        onClick={handlePrevParagraph}
                        disabled={isFirstParagraph}
                    >
                        ← 上一段
                    </button>

                    <button
                        className="control-btn toggle-translation"
                        onClick={() => setShowTranslation(!showTranslation)}
                    >
                        {showTranslation ? '🙈 隐藏译文' : '👁️ 显示译文'}
                    </button>

                    <button
                        className="control-btn primary"
                        onClick={isLastParagraph ? () => setViewMode('library') : handleNextParagraph}
                    >
                        {isLastParagraph ? '✓ 完成' : '下一段 →'}
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default GradedReaderPage;
