/**
 * Writing Practice Component
 * Sentence rearrangement and pinyin-to-character exercises
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { playSuccessSound } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import './WritingPractice.css';

interface HSKItem {
    id: number;
    character: string;
    level: number;
    pinyin?: string;
    meaning?: string;
}

interface WritingPracticeProps {
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

interface WordPiece {
    id: string;
    text: string;
    isCorrect?: boolean;
}

const QUESTIONS_PER_SESSION = 8;
const XP_PER_CORRECT = 18;
const STREAK_BONUS = 8;

// Sample sentence templates for rearrangement
const SENTENCE_TEMPLATES = [
    { parts: ['我', '喜欢', '学习', '中文'], meaning: 'I like studying Chinese' },
    { parts: ['他', '每天', '早上', '起床'], meaning: 'He gets up every morning' },
    { parts: ['这个', '苹果', '很', '好吃'], meaning: 'This apple is delicious' },
    { parts: ['她', '是', '我的', '朋友'], meaning: 'She is my friend' },
    { parts: ['今天', '天气', '很', '好'], meaning: 'The weather is nice today' },
    { parts: ['我们', '一起', '去', '吃饭'], meaning: "Let's go eat together" },
    { parts: ['他', '在', '学校', '学习'], meaning: 'He studies at school' },
    { parts: ['请', '给', '我', '一杯', '水'], meaning: 'Please give me a glass of water' },
    { parts: ['我', '不', '知道', '他的', '名字'], meaning: "I don't know his name" },
    { parts: ['明天', '你', '有', '时间', '吗'], meaning: 'Do you have time tomorrow?' },
];

export const WritingPractice: React.FC<WritingPracticeProps> = ({
    words,
    level,
    onComplete
}) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pieces, setPieces] = useState<WordPiece[]>([]);
    const [correctOrder, setCorrectOrder] = useState<string[]>([]);
    const [meaning, setMeaning] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
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

    // Generate a sentence rearrangement question
    const generateQuestion = useCallback(() => {
        const template = SENTENCE_TEMPLATES[currentIndex % SENTENCE_TEMPLATES.length];
        const shuffled = [...template.parts]
            .map((text, i) => ({ id: `${currentIndex}-${i}`, text }))
            .sort(() => Math.random() - 0.5);

        setPieces(shuffled);
        setCorrectOrder(template.parts);
        setMeaning(template.meaning);
        setIsSubmitted(false);
        setIsCorrect(null);
    }, [currentIndex]);

    useEffect(() => {
        generateQuestion();
    }, [currentIndex, generateQuestion]);

    const handleSubmit = () => {
        if (isSubmitted) return;

        setIsSubmitted(true);
        const userOrder = pieces.map(p => p.text);
        const correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
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

            if (streak >= 2) {
                fireConfetti();
            }
        } else {
            setStats(prev => ({
                ...prev,
                incorrect: prev.incorrect + 1
            }));
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 >= QUESTIONS_PER_SESSION) {
            setShowResult(true);
            setStats(prev => ({
                ...prev,
                totalTime: Math.round((Date.now() - startTime) / 1000)
            }));
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

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
            <div className="writing-practice">
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
        <div className="writing-practice">
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

            {/* Question area */}
            <div className="question-area">
                <div className="question-type-badge">✍️ 句子重组</div>
                <h2 className="question-text">拖拽排列正确的句子</h2>
                <p className="meaning-hint">💡 {meaning}</p>
            </div>

            {/* Draggable pieces */}
            <div className="sentence-builder">
                <Reorder.Group
                    axis="x"
                    values={pieces}
                    onReorder={setPieces}
                    className="pieces-container"
                >
                    {pieces.map((piece) => (
                        <Reorder.Item
                            key={piece.id}
                            value={piece}
                            className={`word-piece ${isSubmitted
                                    ? pieces.map(p => p.text).indexOf(piece.text) === correctOrder.indexOf(piece.text)
                                        ? 'correct'
                                        : 'incorrect'
                                    : ''
                                }`}
                            whileDrag={{ scale: 1.1, zIndex: 10 }}
                            style={{ cursor: isSubmitted ? 'default' : 'grab' }}
                        >
                            {piece.text}
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            {/* Correct answer reveal */}
            <AnimatePresence>
                {isSubmitted && !isCorrect && (
                    <motion.div
                        className="correct-answer-reveal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="label">正确顺序：</span>
                        <span className="answer">{correctOrder.join('')}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="action-buttons">
                {!isSubmitted ? (
                    <motion.button
                        className="submit-btn"
                        onClick={handleSubmit}
                        whileTap={{ scale: 0.98 }}
                    >
                        检查答案
                    </motion.button>
                ) : (
                    <motion.button
                        className={`next-btn ${isCorrect ? 'correct' : 'incorrect'}`}
                        onClick={handleNext}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isCorrect ? '✓ 正确！继续' : '继续'}
                    </motion.button>
                )}
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

export default WritingPractice;
