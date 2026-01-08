/**
 * Achievement Badge Component
 * Displays achievement with unlock animation and glow effects
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, RARITY_COLORS } from '../../data/achievements';
import './AchievementBadge.css';

interface AchievementBadgeProps {
    achievement: Achievement;
    unlocked: boolean;
    isNew?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    achievement,
    unlocked,
    isNew = false,
    size = 'md',
    onClick
}) => {
    const [showSparkles, setShowSparkles] = useState(isNew);
    const colors = RARITY_COLORS[achievement.rarity];

    useEffect(() => {
        if (isNew) {
            const timer = setTimeout(() => setShowSparkles(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isNew]);

    return (
        <motion.div
            className={`achievement-badge size-${size} ${unlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity}`}
            onClick={onClick}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
            style={{
                '--badge-bg': unlocked ? colors.bg : 'rgba(50, 50, 50, 0.5)',
                '--badge-border': unlocked ? colors.border : 'rgba(100, 100, 100, 0.3)',
                '--badge-glow': colors.glow,
            } as React.CSSProperties}
        >
            {/* Glow effect for unlocked */}
            {unlocked && (
                <motion.div
                    className="badge-glow"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}

            {/* Icon */}
            <span className={`badge-icon ${unlocked ? '' : 'grayscale'}`}>
                {unlocked ? achievement.icon : '🔒'}
            </span>

            {/* Title */}
            <span className="badge-title">{achievement.title}</span>

            {/* Sparkles for new unlocks */}
            <AnimatePresence>
                {showSparkles && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="sparkle"
                                initial={{
                                    opacity: 1,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    opacity: [1, 1, 0],
                                    scale: [0, 1, 0.5],
                                    x: Math.cos(i * 60 * Math.PI / 180) * 40,
                                    y: Math.sin(i * 60 * Math.PI / 180) * 40
                                }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.1,
                                    repeat: 2
                                }}
                            >
                                ✨
                            </motion.span>
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* New badge indicator */}
            {isNew && (
                <motion.span
                    className="new-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                >
                    NEW!
                </motion.span>
            )}
        </motion.div>
    );
};

export default AchievementBadge;
