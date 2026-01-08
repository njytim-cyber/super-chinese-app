/**
 * Combo Display Component
 * Shows combo multiplier with fire effects
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ComboDisplay.css';

interface ComboDisplayProps {
    combo: number;
    showBonus?: boolean;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({
    combo,
    showBonus = true
}) => {
    const isOnFire = combo >= 3;
    const isSuper = combo >= 5;
    const isUltra = combo >= 10;

    if (combo < 2) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={`combo-display ${isOnFire ? 'on-fire' : ''} ${isSuper ? 'super' : ''} ${isUltra ? 'ultra' : ''}`}
                key={combo}
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                {/* Fire effect */}
                {isOnFire && (
                    <motion.span
                        className="combo-fire"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        🔥
                    </motion.span>
                )}

                {/* Combo text */}
                <div className="combo-text">
                    <motion.span
                        className="combo-number"
                        animate={{
                            scale: [1, 1.15, 1],
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {combo}x
                    </motion.span>
                    <span className="combo-label">
                        {isUltra ? 'ULTRA!' : isSuper ? 'SUPER!' : 'COMBO'}
                    </span>
                </div>

                {/* Bonus indicator */}
                {showBonus && isOnFire && (
                    <motion.span
                        className="combo-bonus"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        +{isUltra ? '3x' : isSuper ? '2x' : '1.5x'} XP
                    </motion.span>
                )}

                {/* Sparkles for ultra */}
                {isUltra && (
                    <div className="ultra-sparkles">
                        {[...Array(4)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="sparkle"
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: Math.cos(i * 90 * Math.PI / 180) * 30,
                                    y: Math.sin(i * 90 * Math.PI / 180) * 30
                                }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.2,
                                    repeat: Infinity
                                }}
                            >
                                ✨
                            </motion.span>
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ComboDisplay;
