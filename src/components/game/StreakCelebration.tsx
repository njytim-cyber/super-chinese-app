/**
 * Streak Celebration Component
 * Milestone celebrations for learning streaks
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fireConfetti } from '../../utils/confetti';
import './StreakCelebration.css';

interface StreakCelebrationProps {
    streak: number;
    onDismiss?: () => void;
}

const MILESTONES = [
    { days: 7, emoji: '🔥', title: '一周连胜!', subtitle: 'One Week Streak!' },
    { days: 14, emoji: '⚡', title: '两周连胜!', subtitle: 'Two Week Streak!' },
    { days: 30, emoji: '🌟', title: '一个月连胜!', subtitle: 'One Month Streak!' },
    { days: 50, emoji: '💫', title: '五十天连胜!', subtitle: 'Fifty Day Streak!' },
    { days: 100, emoji: '🏆', title: '百日连胜!', subtitle: 'Hundred Day Streak!' },
    { days: 365, emoji: '👑', title: '一年连胜!', subtitle: 'One Year Streak!' },
];

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
    streak,
    onDismiss
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // Derive milestone directly from props
    const milestone = MILESTONES.find(m => m.days === streak);

    useEffect(() => {
        if (milestone) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            fireConfetti(3);

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                onDismiss?.();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [milestone, onDismiss]);

    if (!milestone || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="streak-celebration-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setIsVisible(false);
                        onDismiss?.();
                    }}
                >
                    <motion.div
                        className="streak-celebration-card"
                        initial={{ scale: 0.5, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.span
                            className="celebration-emoji"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, -10, 10, 0]
                            }}
                            transition={{ duration: 0.5, repeat: 3 }}
                        >
                            {milestone.emoji}
                        </motion.span>

                        <h2 className="celebration-title">{milestone.title}</h2>
                        <p className="celebration-subtitle">{milestone.subtitle}</p>

                        <div className="celebration-streak">
                            <span className="streak-number">{streak}</span>
                            <span className="streak-label">天连续学习</span>
                        </div>

                        <motion.button
                            className="celebration-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsVisible(false);
                                onDismiss?.();
                            }}
                        >
                            继续加油! 💪
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StreakCelebration;
