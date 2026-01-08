/**
 * SRS Dashboard Component
 * Displays learning statistics, memory health, and projected fluency date
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFSRSStore } from '../../stores/fsrsStore';
import './SRSDashboard.css';

interface SRSDashboardProps {
    targetLevel?: number; // HSK level target (e.g., 4 = HSK 4)
    compact?: boolean;
}

// HSK level word targets
const HSK_WORD_TARGETS: Record<number, number> = {
    1: 500,
    2: 1272, // cumulative
    3: 2245,
    4: 3245,
    5: 4316,
    6: 11092,
};

export const SRSDashboard: React.FC<SRSDashboardProps> = ({
    targetLevel = 4,
    compact = false
}) => {
    const { cards, getCounts, logs } = useFSRSStore();
    const counts = getCounts();

    // Calculate statistics
    const stats = useMemo(() => {
        const cardValues = Object.values(cards);
        const totalCards = cardValues.length;
        const reviewedCards = cardValues.filter(c => c.state !== 'New').length;
        const masteredCards = cardValues.filter(c => c.state === 'Review' && c.stability > 30).length;

        // Calculate memory health (average stability of reviewed cards)
        const avgStability = reviewedCards > 0
            ? cardValues.reduce((sum, c) => sum + c.stability, 0) / reviewedCards
            : 0;

        // Memory health as percentage (stability 30+ = 100%)
        const memoryHealth = Math.min(100, Math.round((avgStability / 30) * 100));

        // Calculate learning velocity (cards learned per day over last 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentLogs = logs.filter(l => new Date(l.reviewedAt).getTime() > sevenDaysAgo);
        const uniqueCardsReviewed = new Set(recentLogs.map(l => l.cardId)).size;
        const cardsPerDay = uniqueCardsReviewed / 7;

        // Projected fluency date
        const targetWords = HSK_WORD_TARGETS[targetLevel] || 3000;
        const wordsRemaining = Math.max(0, targetWords - reviewedCards);
        const daysToFluency = cardsPerDay > 0 ? Math.ceil(wordsRemaining / cardsPerDay) : null;
        const fluencyDate = daysToFluency
            ? new Date(Date.now() + daysToFluency * 24 * 60 * 60 * 1000)
            : null;

        return {
            totalCards,
            reviewedCards,
            masteredCards,
            memoryHealth,
            cardsPerDay: Math.round(cardsPerDay * 10) / 10,
            fluencyDate,
            daysToFluency,
            targetWords,
            progress: Math.round((reviewedCards / targetWords) * 100)
        };
    }, [cards, logs, targetLevel, getCounts]);

    // Format date nicely
    const formatDate = (date: Date | null): string => {
        if (!date) return '--';
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Memory health color
    const getHealthColor = (health: number): string => {
        if (health >= 80) return '#4caf50';
        if (health >= 50) return '#ffc107';
        return '#f44336';
    };

    if (compact) {
        return (
            <div className="srs-dashboard compact">
                <div className="compact-stats">
                    <div className="compact-stat">
                        <span className="value">{stats.reviewedCards}</span>
                        <span className="label">已学</span>
                    </div>
                    <div className="compact-stat">
                        <span className="value" style={{ color: getHealthColor(stats.memoryHealth) }}>
                            {stats.memoryHealth}%
                        </span>
                        <span className="label">记忆</span>
                    </div>
                    <div className="compact-stat">
                        <span className="value">{counts.due}</span>
                        <span className="label">待复习</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="srs-dashboard">
            <h3 className="dashboard-title">📊 学习仪表盘</h3>

            {/* Progress towards target */}
            <div className="progress-section">
                <div className="progress-header">
                    <span>进度: HSK {targetLevel}</span>
                    <span>{stats.reviewedCards} / {stats.targetWords}</span>
                </div>
                <div className="progress-track">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
                <span className="progress-percent">{stats.progress}%</span>
            </div>

            {/* Stats grid */}
            <div className="stats-grid">
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="stat-icon">📚</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.reviewedCards}</span>
                        <span className="stat-label">已学词汇</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="stat-icon">✅</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.masteredCards}</span>
                        <span className="stat-label">已掌握</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="stat-icon">🧠</span>
                    <div className="stat-content">
                        <span
                            className="stat-value"
                            style={{ color: getHealthColor(stats.memoryHealth) }}
                        >
                            {stats.memoryHealth}%
                        </span>
                        <span className="stat-label">记忆健康</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="stat-icon">⚡</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.cardsPerDay}</span>
                        <span className="stat-label">词/天</span>
                    </div>
                </motion.div>
            </div>

            {/* Due reviews */}
            <div className="due-section">
                <div className="due-counts">
                    <div className="due-item new">
                        <span className="count">{counts.new}</span>
                        <span className="label">新词</span>
                    </div>
                    <div className="due-item learning">
                        <span className="count">{counts.learning}</span>
                        <span className="label">学习中</span>
                    </div>
                    <div className="due-item review">
                        <span className="count">{counts.due}</span>
                        <span className="label">待复习</span>
                    </div>
                </div>
            </div>

            {/* Projected fluency */}
            <motion.div
                className="fluency-projection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className="fluency-icon">🎯</span>
                <div className="fluency-content">
                    <span className="fluency-label">预计达成 HSK {targetLevel}</span>
                    <span className="fluency-date">
                        {stats.daysToFluency
                            ? `${formatDate(stats.fluencyDate)} (${stats.daysToFluency}天)`
                            : '开始学习后计算'
                        }
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default SRSDashboard;
