/**
 * Level Up Celebration Component
 * Full-screen celebration when user levels up
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fireConfetti } from '../../utils/confetti';
import './LevelUpCelebration.css';

interface LevelUpCelebrationProps {
    newLevel: number;
    xpEarned?: number;
    onComplete: () => void;
}

const LEVEL_TITLES: Record<number, { zh: string; en: string }> = {
    1: { zh: '初学者', en: 'Beginner' },
    2: { zh: '学徒', en: 'Apprentice' },
    3: { zh: '探索者', en: 'Explorer' },
    4: { zh: '学者', en: 'Scholar' },
    5: { zh: '达人', en: 'Expert' },
    6: { zh: '大师', en: 'Master' },
    7: { zh: '宗师', en: 'Grandmaster' },
    8: { zh: '传奇', en: 'Legend' },
    9: { zh: '神话', en: 'Mythic' },
    10: { zh: '至尊', en: 'Supreme' },
};

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
    newLevel,
    xpEarned = 0,
    onComplete
}) => {
    const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
    const levelTitle = LEVEL_TITLES[newLevel] || LEVEL_TITLES[10];

    useEffect(() => {
        // Fire confetti on mount
        fireConfetti();

        // Phase transitions
        const enterTimer = setTimeout(() => setPhase('show'), 500);
        const exitTimer = setTimeout(() => {
            setPhase('exit');
            setTimeout(onComplete, 500);
        }, 3500);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                className="level-up-celebration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Background particles */}
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 20,
                                opacity: 0
                            }}
                            animate={{
                                y: -50,
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                delay: Math.random() * 2,
                                repeat: Infinity
                            }}
                        />
                    ))}
                </div>

                {/* Main content */}
                <motion.div
                    className="celebration-content"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.2
                    }}
                >
                    {/* Level up text */}
                    <motion.div
                        className="level-up-text"
                        animate={{
                            scale: [1, 1.1, 1],
                            textShadow: [
                                '0 0 20px rgba(255,215,0,0.5)',
                                '0 0 40px rgba(255,215,0,0.8)',
                                '0 0 20px rgba(255,215,0,0.5)'
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        🎉 LEVEL UP! 🎉
                    </motion.div>

                    {/* Level number */}
                    <motion.div
                        className="level-number"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="level-label">LV</span>
                        <span className="level-value">{newLevel}</span>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        className="level-title"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="title-zh">{levelTitle.zh}</span>
                        <span className="title-en">{levelTitle.en}</span>
                    </motion.div>

                    {/* XP earned */}
                    {xpEarned > 0 && (
                        <motion.div
                            className="xp-earned"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring' }}
                        >
                            +{xpEarned} XP
                        </motion.div>
                    )}

                    {/* Stars */}
                    <div className="stars-container">
                        {[...Array(5)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="star"
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.8 + i * 0.1,
                                    type: 'spring',
                                    stiffness: 300
                                }}
                            >
                                ⭐
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Tap to continue */}
                <motion.div
                    className="tap-continue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={onComplete}
                >
                    Tap to continue
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LevelUpCelebration;
