/**
 * Listening Practice Component
 * Audio matching game for HSK vocabulary
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { speakChinese, playSuccessSound } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { ComboDisplay, Mascot } from '../game';
import type { MascotMood } from '../game';
import './ListeningPractice.css';

// HSK Item type from enriched data
interface HSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

interface ListeningPracticeProps {
    words: HSKItem[];
    level: number;
    onComplete?: (stats: PracticeStats) => void;
}

interface PracticeStats {
    correct: number;
    incorrect: number;
    totalTime: number;
    xpEarned: number;
}

const QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 15;
const STREAK_BONUS = 5;

export const ListeningPractice: React.FC<ListeningPracticeProps> = ({
    words,
    level,
    onComplete
}) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<HSKItem[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<HSKItem | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<HSKItem | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [stats, setStats] = useState<PracticeStats>({
        correct: 0,
        incorrect: 0,
        totalTime: 0,
        xpEarned: 0
    });
    // eslint-disable-next-line react-hooks/purity
    const [startTime] = useState(Date.now());
    const [showResult, setShowResult] = useState(false);
    const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
    const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

    // Generate a question with 4 random options
    const generateQuestion = useCallback(() => {
        if (words.length < 4) return;

        // Pick a random word as the correct answer
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        const correct = shuffled[currentIndex % shuffled.length];

        // Get 3 wrong options
        const wrongOptions = shuffled
            .filter(w => w.character !== correct.character)
            .slice(0, 3);

        // Shuffle all options
        const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);

        setCorrectAnswer(correct);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setIsCorrect(null);
    }, [words, currentIndex]);

    // Play audio for current word
    const playAudio = useCallback(() => {
        if (correctAnswer) {
            speakChinese(correctAnswer.character);
        }
    }, [correctAnswer]);

    // Handle answer selection
    const handleSelect = (option: HSKItem) => {
        if (selectedAnswer) return; // Already answered

        setSelectedAnswer(option);
        const correct = option.character === correctAnswer?.character;
        setIsCorrect(correct);

        if (correct) {
            playSuccessSound(Math.min(streak, 3));
            const xp = XP_PER_CORRECT + (streak >= 3 ? STREAK_BONUS : 0);
            setStats(prev => ({
                ...prev,
                correct: prev.correct + 1,
                xpEarned: prev.xpEarned + xp
            }));
            setStreak(prev => prev + 1);
            setMascotMood(streak >= 4 ? 'celebrating' : streak >= 2 ? 'excited' : 'happy');

            if (streak >= 4) {
                fireConfetti();
            }
        } else {
            setStats(prev => ({
                ...prev,
                incorrect: prev.incorrect + 1
            }));
            setStreak(0);
            setMascotMood('encouraging');
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentIndex + 1 >= QUESTIONS_PER_SESSION) {
                // Session complete
                setShowResult(true);
                setStats(prev => ({
                    ...prev,
                    totalTime: Math.round((Date.now() - startTime) / 1000)
                }));
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }, correct ? 1200 : 2000);
    };

    // Generate new question when index changes
    useEffect(() => {
        generateQuestion();
    }, [currentIndex, generateQuestion]);

    // Auto-play audio when question loads
    useEffect(() => {
        if (correctAnswer && autoPlayEnabled) {
            const timer = setTimeout(playAudio, 300);
            return () => clearTimeout(timer);
        }
    }, [correctAnswer, autoPlayEnabled, playAudio]);

    // Handle session complete
    const handleFinish = () => {
        onComplete?.(stats);
        navigate('/');
    };

    const handlePlayAgain = () => {
        setCurrentIndex(0);
        setStats({ correct: 0, incorrect: 0, totalTime: 0, xpEarned: 0 });
        setStreak(0);
        setShowResult(false);
    };

    // Results screen
    if (showResult) {
        const accuracy = stats.correct / (stats.correct + stats.incorrect) * 100;

        return (
            <div className="listening-practice">
                <motion.div
                    className="results-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2>🎉 练习完成！</h2>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{stats.correct}</span>
                            <span className="stat-label">正确</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{accuracy.toFixed(0)}%</span>
                            <span className="stat-label">准确率</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">+{stats.xpEarned}</span>
                            <span className="stat-label">XP</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.totalTime}s</span>
                            <span className="stat-label">用时</span>
                        </div>
                    </div>

                    <div className="results-actions">
                        <button className="btn-primary" onClick={handlePlayAgain}>
                            🔄 再来一轮
                        </button>
                        <button className="btn-secondary" onClick={handleFinish}>
                            ✓ 完成
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="listening-practice">
            {/* Header */}
            <div className="practice-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>
                <div className="progress-info">
                    <span className="level-badge">HSK {level}</span>
                    <span className="question-count">{currentIndex + 1} / {QUESTIONS_PER_SESSION}</span>
                </div>
                <ComboDisplay combo={streak} />
            </div>

            {/* Progress bar */}
            <div className="progress-bar">
                <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / QUESTIONS_PER_SESSION) * 100}%` }}
                />
            </div>

            {/* Mascot */}
            <div className="mascot-container">
                <Mascot
                    mood={mascotMood}
                    size="md"
                    showBubble={isCorrect !== null}
                />
            </div>

            {/* Question area */}
            <div className="question-area">
                <h2 className="question-text">听一听，选正确的词</h2>

                <motion.button
                    className="play-audio-btn"
                    onClick={playAudio}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <span className="audio-icon">🔊</span>
                    <span>播放</span>
                </motion.button>

                <label className="auto-play-toggle">
                    <input
                        type="checkbox"
                        checked={autoPlayEnabled}
                        onChange={e => setAutoPlayEnabled(e.target.checked)}
                    />
                    自动播放
                </label>
            </div>

            {/* Options grid */}
            <div className="options-grid">
                <AnimatePresence mode="wait">
                    {options.map((option, idx) => (
                        <motion.button
                            key={`${currentIndex}-${option.id}`}
                            className={`option-card ${selectedAnswer === option
                                ? isCorrect ? 'correct' : 'incorrect'
                                : selectedAnswer && option.character === correctAnswer?.character
                                    ? 'reveal-correct'
                                    : ''
                                }`}
                            onClick={() => handleSelect(option)}
                            disabled={!!selectedAnswer}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                            whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                        >
                            <span className="option-character">{option.character}</span>
                            {selectedAnswer && (
                                <motion.span
                                    className="option-meaning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {option.meaning}
                                </motion.span>
                            )}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* XP popup on correct */}
            <AnimatePresence>
                {isCorrect && (
                    <motion.div
                        className="xp-popup"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        +{XP_PER_CORRECT + (streak >= 3 ? STREAK_BONUS : 0)} XP
                        {streak >= 3 && <span className="streak-bonus">🔥 Streak!</span>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ListeningPractice;
