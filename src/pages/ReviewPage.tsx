import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFSRSStore, useGameStore } from '../stores';
import type { FSRSRating } from '../types/fsrs.types';
import { speakChinese, playSuccessSound, fireConfetti } from '../utils';
import { Button } from '../components/ui';
import './ReviewPage.css';

// Mock dictionary for card display (would be connected to HSK data)
const CARD_DATA: Record<string, { pinyin: string; meaning: string }> = {
    '今天': { pinyin: 'jīntiān', meaning: 'today' },
    '早上': { pinyin: 'zǎoshang', meaning: 'morning' },
    '我': { pinyin: 'wǒ', meaning: 'I; me' },
    '六': { pinyin: 'liù', meaning: 'six' },
    '点': { pinyin: 'diǎn', meaning: "o'clock" },
    '起床': { pinyin: 'qǐchuáng', meaning: 'to get up' },
    '吃': { pinyin: 'chī', meaning: 'to eat' },
    '早饭': { pinyin: 'zǎofàn', meaning: 'breakfast' },
    '学校': { pinyin: 'xuéxiào', meaning: 'school' },
    '下午': { pinyin: 'xiàwǔ', meaning: 'afternoon' },
    '回家': { pinyin: 'huí jiā', meaning: 'to return home' },
};

const RATING_BUTTONS: { rating: FSRSRating; label: string; color: string; icon: string }[] = [
    { rating: 'Again', label: 'Again', color: 'var(--md-sys-color-error)', icon: '🔄' },
    { rating: 'Hard', label: 'Hard', color: 'var(--md-sys-color-tertiary)', icon: '😓' },
    { rating: 'Good', label: 'Good', color: 'var(--md-sys-color-primary)', icon: '👍' },
    { rating: 'Easy', label: 'Easy', color: 'var(--md-sys-color-secondary)', icon: '⭐' },
];

export function ReviewPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getDueCards, reviewCard, getCounts } = useFSRSStore();
    const { addXP } = useGameStore();

    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionStats, setSessionStats] = useState({ reviewed: 0, xpEarned: 0 });
    const [isComplete, setIsComplete] = useState(false);

    const dueCards = useMemo(() => getDueCards(), [getDueCards]);
    const currentCard = dueCards[0];
    const cardInfo = currentCard ? CARD_DATA[currentCard.id] : null;
    const counts = getCounts();

    const handleShowAnswer = useCallback(() => {
        setShowAnswer(true);
        if (currentCard) {
            speakChinese(currentCard.id);
        }
    }, [currentCard]);

    const handleRate = useCallback((rating: FSRSRating) => {
        if (!currentCard) return;

        reviewCard(currentCard.id, rating);

        // Award XP based on rating
        const xpAmount = rating === 'Again' ? 2 : rating === 'Hard' ? 5 : rating === 'Good' ? 10 : 15;
        addXP({ type: 'character_complete', amount: xpAmount, timestamp: new Date() });

        // Update session stats
        setSessionStats(prev => ({
            reviewed: prev.reviewed + 1,
            xpEarned: prev.xpEarned + xpAmount
        }));

        // Play sound for successful reviews
        if (rating !== 'Again') {
            playSuccessSound(0);
        }

        // Reset for next card
        setShowAnswer(false);

        // Check if session complete
        if (dueCards.length <= 1) {
            fireConfetti(2);
            setIsComplete(true);
        }
    }, [currentCard, reviewCard, addXP, dueCards.length]);

    // Session complete screen
    if (isComplete || !currentCard) {
        return (
            <div className="review-page">
                <motion.div
                    className="review-complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="complete-icon">🎉</div>
                    <h2>{t('review.complete', 'Session Complete!')}</h2>
                    <div className="complete-stats">
                        <div className="stat-item">
                            <span className="stat-value">{sessionStats.reviewed}</span>
                            <span className="stat-label">{t('review.cardsReviewed', 'cards reviewed')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">+{sessionStats.xpEarned}</span>
                            <span className="stat-label">XP</span>
                        </div>
                    </div>
                    <Button variant="primary" size="lg" onClick={() => navigate('/')}>
                        {t('common.done', 'Done')}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="review-page">
            {/* Header */}
            <header className="review-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <div className="review-counts">
                    <span className="count new">{counts.new}</span>
                    <span className="count learning">{counts.learning}</span>
                    <span className="count review">{counts.due}</span>
                </div>
                <div className="session-xp">+{sessionStats.xpEarned} XP</div>
            </header>

            {/* Card */}
            <div className="review-card-container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard.id}
                        className="review-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                    >
                        <div className="card-front">
                            <span className="card-character">{currentCard.id}</span>
                        </div>

                        {showAnswer && cardInfo && (
                            <motion.div
                                className="card-back"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="card-pinyin">{cardInfo.pinyin}</span>
                                <span className="card-meaning">{cardInfo.meaning}</span>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="review-actions">
                {!showAnswer ? (
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleShowAnswer}
                    >
                        {t('review.showAnswer', 'Show Answer')}
                    </Button>
                ) : (
                    <div className="rating-buttons">
                        {RATING_BUTTONS.map(({ rating, label, color, icon }) => (
                            <motion.button
                                key={rating}
                                className="rating-btn"
                                style={{ '--rating-color': color } as React.CSSProperties}
                                onClick={() => handleRate(rating)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="rating-icon">{icon}</span>
                                <span className="rating-label">{t(`review.${rating.toLowerCase()}`, label)}</span>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewPage;
