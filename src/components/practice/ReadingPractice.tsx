/**
 * Reading Practice Component
 * Word-to-meaning matching and fill-in-the-blank exercises
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playSuccessSound } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import './ReadingPractice.css';

interface HSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

interface ReadingPracticeProps {
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

type QuestionType = 'word-to-meaning' | 'meaning-to-word' | 'fill-blank';

const QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 12;
const STREAK_BONUS = 5;

export const ReadingPractice: React.FC<ReadingPracticeProps> = ({
    words,
    level,
    onComplete
}) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionType, setQuestionType] = useState<QuestionType>('word-to-meaning');
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
    const [startTime] = useState(Date.now());
    const [showResult, setShowResult] = useState(false);
    const [fillBlankSentence, setFillBlankSentence] = useState('');

    // Generate a question
    const generateQuestion = useCallback(() => {
        if (words.length < 4) return;

        // Alternate question types
        const types: QuestionType[] = ['word-to-meaning', 'meaning-to-word', 'fill-blank'];
        const type = types[currentIndex % 3];
        setQuestionType(type);

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

        // Generate fill-in-the-blank sentence
        if (type === 'fill-blank') {
            const templates = [
                `今天我想${correct.character}。`,
                `他们都喜欢${correct.character}。`,
                `我的朋友会${correct.character}。`,
                `这个${correct.character}很好看。`,
                `她每天都${correct.character}。`
            ];
            setFillBlankSentence(templates[Math.floor(Math.random() * templates.length)]);
        }
    }, [words, currentIndex]);

    // Handle answer selection
    const handleSelect = (option: HSKItem) => {
        if (selectedAnswer) return;

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

            if (streak >= 4) {
                fireConfetti();
            }
        } else {
            setStats(prev => ({
                ...prev,
                incorrect: prev.incorrect + 1
            }));
            setStreak(0);
        }

        // Auto advance
        setTimeout(() => {
            if (currentIndex + 1 >= QUESTIONS_PER_SESSION) {
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

    useEffect(() => {
        generateQuestion();
    }, [currentIndex, generateQuestion]);

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
            <div className="reading-practice">
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

    // Get question prompt based on type
    const getQuestionPrompt = () => {
        switch (questionType) {
            case 'word-to-meaning':
                return '选择正确的意思';
            case 'meaning-to-word':
                return '选择正确的词';
            case 'fill-blank':
                return '选择填入空白处的词';
            default:
                return '';
        }
    };

    // Get display content based on question type
    const getQuestionDisplay = () => {
        if (questionType === 'word-to-meaning') {
            return (
                <div className="question-display">
                    <span className="chinese-word">{correctAnswer?.character}</span>
                    <span className="pinyin-hint">{correctAnswer?.pinyin}</span>
                </div>
            );
        }
        if (questionType === 'meaning-to-word') {
            return (
                <div className="question-display">
                    <span className="english-meaning">{correctAnswer?.meaning}</span>
                </div>
            );
        }
        if (questionType === 'fill-blank') {
            return (
                <div className="question-display fill-blank">
                    <span className="sentence">
                        {fillBlankSentence.replace(correctAnswer?.character || '', '______')}
                    </span>
                </div>
            );
        }
        return null;
    };

    // Get option display based on question type
    const getOptionDisplay = (option: HSKItem) => {
        if (questionType === 'word-to-meaning') {
            return option.meaning;
        }
        return option.character;
    };

    return (
        <div className="reading-practice">
            {/* Header */}
            <div className="practice-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>
                <div className="progress-info">
                    <span className="level-badge">HSK {level}</span>
                    <span className="question-count">{currentIndex + 1} / {QUESTIONS_PER_SESSION}</span>
                </div>
                <div className="streak-badge" data-active={streak >= 3}>
                    🔥 {streak}
                </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar">
                <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / QUESTIONS_PER_SESSION) * 100}%` }}
                />
            </div>

            {/* Question type badge */}
            <div className="question-type-badge">
                {questionType === 'word-to-meaning' && '📖 词义匹配'}
                {questionType === 'meaning-to-word' && '🔤 词语识别'}
                {questionType === 'fill-blank' && '📝 填空题'}
            </div>

            {/* Question area */}
            <div className="question-area">
                <h2 className="question-text">{getQuestionPrompt()}</h2>
                {getQuestionDisplay()}
            </div>

            {/* Options */}
            <div className="options-list">
                <AnimatePresence mode="wait">
                    {options.map((option, idx) => (
                        <motion.button
                            key={`${currentIndex}-${option.id}`}
                            className={`option-btn ${selectedAnswer === option
                                    ? isCorrect ? 'correct' : 'incorrect'
                                    : selectedAnswer && option.character === correctAnswer?.character
                                        ? 'reveal-correct'
                                        : ''
                                }`}
                            onClick={() => handleSelect(option)}
                            disabled={!!selectedAnswer}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={!selectedAnswer ? { scale: 1.01, x: 5 } : {}}
                            whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{getOptionDisplay(option)}</span>
                            {selectedAnswer && option.character === correctAnswer?.character && (
                                <span className="correct-indicator">✓</span>
                            )}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* XP popup */}
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

export default ReadingPractice;
