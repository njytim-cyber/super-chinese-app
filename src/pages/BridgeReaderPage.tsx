/**
 * Bridge Content Reader Page
 * For intermediate learners (HSK 4-6) to practice reading comprehension
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRIDGE_PASSAGES } from '../data/bridgeContent';
import type { BridgePassage } from '../data/bridgeContent';
import { speakChinese } from '../utils/audio';
import { playSuccessSound } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import './BridgeReaderPage.css';

type ViewMode = 'list' | 'reading' | 'quiz';

export const BridgeReaderPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedPassage, setSelectedPassage] = useState<BridgePassage | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

    const handleSelectPassage = (passage: BridgePassage) => {
        setSelectedPassage(passage);
        setViewMode('reading');
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
    };

    const handleStartQuiz = () => {
        setViewMode('quiz');
        setCurrentQuestionIndex(0);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (showResults) return;

        const isCorrect = answerIndex === selectedPassage?.questions[currentQuestionIndex].correctIndex;

        if (isCorrect) {
            playSuccessSound(0);
        }

        setSelectedAnswers(prev => [...prev, answerIndex]);

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestionIndex + 1 >= (selectedPassage?.questions.length || 0)) {
                setShowResults(true);
                const correctCount = selectedAnswers.filter((a, i) =>
                    a === selectedPassage?.questions[i].correctIndex
                ).length + (isCorrect ? 1 : 0);

                if (correctCount >= 2) {
                    fireConfetti();
                }
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 1000);
    };

    const handleWordClick = (word: string) => {
        setHighlightedWord(word);
        speakChinese(word);
    };

    const getLevelColor = (level: number) => {
        switch (level) {
            case 4: return '#48bb78';
            case 5: return '#667eea';
            case 6: return '#ed8936';
            default: return '#667eea';
        }
    };

    // Passage list view
    if (viewMode === 'list') {
        return (
            <div className="bridge-reader-page">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h1>📚 桥梁阅读</h1>
                    <div className="header-spacer" />
                </header>

                <p className="page-description">
                    专为中级学习者设计的阅读材料，帮助跨越 HSK 4-6 的"中级平台"
                </p>

                <div className="passage-list">
                    {BRIDGE_PASSAGES.map((passage, idx) => (
                        <motion.button
                            key={passage.id}
                            className="passage-card"
                            onClick={() => handleSelectPassage(passage)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="passage-level" style={{ background: getLevelColor(passage.level) }}>
                                HSK {passage.level}
                            </div>
                            <div className="passage-info">
                                <span className="passage-title">{passage.title}</span>
                                <span className="passage-title-en">{passage.titleEn}</span>
                            </div>
                            <span className="passage-arrow">→</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    // Reading view
    if (viewMode === 'reading' && selectedPassage) {
        const renderContentWithVocab = () => {
            const content = selectedPassage.content;
            const parts: React.ReactNode[] = [];
            let lastIndex = 0;

            selectedPassage.vocabulary.forEach(word => {
                const index = content.indexOf(word);
                if (index !== -1) {
                    // Add text before this word
                    if (index > lastIndex) {
                        parts.push(content.substring(lastIndex, index));
                    }
                    // Add the vocab word as clickable
                    parts.push(
                        <span
                            key={`${word}-${index}`}
                            className={`vocab-word ${highlightedWord === word ? 'highlighted' : ''}`}
                            onClick={() => handleWordClick(word)}
                        >
                            {word}
                        </span>
                    );
                    lastIndex = index + word.length;
                }
            });

            // Add remaining text
            if (lastIndex < content.length) {
                parts.push(content.substring(lastIndex));
            }

            return parts.length > 0 ? parts : content;
        };

        return (
            <div className="bridge-reader-page reading-mode">
                <header className="page-header">
                    <button className="back-btn" onClick={() => setViewMode('list')}>←</button>
                    <h1>{selectedPassage.title}</h1>
                    <div className="level-badge" style={{ background: getLevelColor(selectedPassage.level) }}>
                        HSK {selectedPassage.level}
                    </div>
                </header>

                <div className="reading-content">
                    <p className="passage-text">
                        {renderContentWithVocab()}
                    </p>
                </div>

                <div className="vocab-list">
                    <h4>📝 生词 Vocabulary</h4>
                    <div className="vocab-chips">
                        {selectedPassage.vocabulary.map(word => (
                            <button
                                key={word}
                                className={`vocab-chip ${highlightedWord === word ? 'active' : ''}`}
                                onClick={() => handleWordClick(word)}
                            >
                                🔊 {word}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="start-quiz-btn" onClick={handleStartQuiz}>
                    开始测验 →
                </button>
            </div>
        );
    }

    // Quiz view
    if (viewMode === 'quiz' && selectedPassage) {
        const currentQuestion = selectedPassage.questions[currentQuestionIndex];
        const userAnswer = selectedAnswers[currentQuestionIndex];
        const hasAnswered = userAnswer !== undefined;

        if (showResults) {
            const correctCount = selectedAnswers.filter((a, i) =>
                a === selectedPassage.questions[i].correctIndex
            ).length;
            const totalQuestions = selectedPassage.questions.length;

            return (
                <div className="bridge-reader-page quiz-mode">
                    <motion.div
                        className="quiz-results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2>🎉 测验完成！</h2>
                        <div className="results-score">
                            <span className="score">{correctCount}/{totalQuestions}</span>
                            <span className="label">正确</span>
                        </div>
                        <div className="results-actions">
                            <button className="btn-primary" onClick={() => handleSelectPassage(selectedPassage)}>
                                重新阅读
                            </button>
                            <button className="btn-secondary" onClick={() => setViewMode('list')}>
                                选择其他文章
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return (
            <div className="bridge-reader-page quiz-mode">
                <header className="page-header">
                    <button className="back-btn" onClick={() => setViewMode('reading')}>←</button>
                    <span className="quiz-progress">{currentQuestionIndex + 1}/{selectedPassage.questions.length}</span>
                    <div className="header-spacer" />
                </header>

                <div className="quiz-content">
                    <h3 className="question-text">{currentQuestion.question}</h3>

                    <div className="answer-options">
                        {currentQuestion.options.map((option, idx) => (
                            <motion.button
                                key={idx}
                                className={`answer-option ${hasAnswered
                                    ? idx === currentQuestion.correctIndex
                                        ? 'correct'
                                        : idx === userAnswer
                                            ? 'incorrect'
                                            : ''
                                    : ''
                                    }`}
                                onClick={() => !hasAnswered && handleAnswerSelect(idx)}
                                disabled={hasAnswered}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="option-text">{option}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default BridgeReaderPage;
