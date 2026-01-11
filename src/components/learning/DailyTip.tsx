/**
 * Daily Tip Component
 * Rotating tips for Chinese learners
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DailyTip.css';

interface Tip {
    emoji: string;
    category: 'grammar' | 'culture' | 'study' | 'motivation';
    chinese: string;
    english: string;
}

const TIPS: Tip[] = [
    { emoji: '📚', category: 'grammar', chinese: '四声很重要。同样的音节，声调不同，意思完全不同！', english: 'Tones matter! The same syllable with different tones has completely different meanings.' },
    { emoji: '🎯', category: 'study', chinese: '每天学5-10个新字，坚持比速度更重要。', english: 'Learn 5-10 new characters daily. Consistency beats speed.' },
    { emoji: '🏮', category: 'culture', chinese: '红色在中国文化中代表好运和喜庆。', english: 'Red symbolizes good luck and celebration in Chinese culture.' },
    { emoji: '💪', category: 'motivation', chinese: '千里之行，始于足下。', english: 'A journey of a thousand miles begins with a single step.' },
    { emoji: '✍️', category: 'study', chinese: '练习写字可以帮助你更好地记住汉字。', english: 'Practicing writing helps you remember characters better.' },
    { emoji: '🎵', category: 'study', chinese: '听中文歌曲是学习语调的好方法。', english: 'Listening to Chinese songs is great for learning tones.' },
    { emoji: '🗣️', category: 'grammar', chinese: '中文没有动词变位，时态用时间词表达。', english: 'Chinese has no verb conjugation. Tense is expressed with time words.' },
    { emoji: '🎭', category: 'culture', chinese: '面子文化在中国社会中非常重要。', english: '"Face" (miànzi) is a crucial concept in Chinese society.' },
    { emoji: '⭐', category: 'motivation', chinese: '学习一门新语言就是打开一个新世界的大门。', english: 'Learning a new language opens doors to a new world.' },
    { emoji: '🧠', category: 'study', chinese: '睡前复习效果最好，大脑会在睡眠中巩固记忆。', english: 'Reviewing before sleep is most effective - your brain consolidates memory during sleep.' },
];

interface DailyTipProps {
    /** Show compact version */
    compact?: boolean;
}

export const DailyTip: React.FC<DailyTipProps> = ({ compact = false }) => {
    // Use date as seed for consistent daily tip
    const todaysTip = useMemo(() => {
        const dayOfYear = Math.floor(
            // eslint-disable-next-line react-hooks/purity
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        return TIPS[dayOfYear % TIPS.length];
    }, []);

    const [isFlipped, setIsFlipped] = useState(false);

    const categoryColors: Record<string, string> = {
        grammar: 'var(--primary)',
        culture: 'var(--tertiary)',
        study: 'var(--secondary)',
        motivation: 'var(--error, #e57373)'
    };

    if (compact) {
        return (
            <motion.div
                className="daily-tip-compact"
                whileHover={{ scale: 1.02 }}
            >
                <span className="tip-emoji">{todaysTip.emoji}</span>
                <span className="tip-text">{todaysTip.chinese}</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="daily-tip"
            onClick={() => setIsFlipped(!isFlipped)}
            whileHover={{ scale: 1.02 }}
            style={{ '--category-color': categoryColors[todaysTip.category] } as React.CSSProperties}
        >
            <div className="tip-header">
                <span className="tip-emoji">{todaysTip.emoji}</span>
                <span className="tip-label">每日提示 / Daily Tip</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={isFlipped ? 'english' : 'chinese'}
                    className="tip-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {isFlipped ? todaysTip.english : todaysTip.chinese}
                </motion.div>
            </AnimatePresence>

            <span className="tip-flip-hint">
                {isFlipped ? '点击看中文' : 'Tap for English'}
            </span>
        </motion.div>
    );
};

export default DailyTip;
