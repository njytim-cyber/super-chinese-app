/**
 * Mascot Component
 * Cute panda mascot with emotional reactions
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Mascot.css';

export type MascotMood =
    | 'idle'
    | 'happy'
    | 'excited'
    | 'thinking'
    | 'sad'
    | 'encouraging'
    | 'celebrating'
    | 'sleeping';

interface MascotProps {
    mood: MascotMood;
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    showBubble?: boolean;
}

const MASCOT_EXPRESSIONS: Record<MascotMood, { emoji: string; animation: string }> = {
    idle: { emoji: '🐼', animation: 'idle' },
    happy: { emoji: '🐼', animation: 'happy' },
    excited: { emoji: '🐼', animation: 'excited' },
    thinking: { emoji: '🐼', animation: 'thinking' },
    sad: { emoji: '🐼', animation: 'sad' },
    encouraging: { emoji: '🐼', animation: 'encouraging' },
    celebrating: { emoji: '🐼', animation: 'celebrating' },
    sleeping: { emoji: '🐼', animation: 'sleeping' },
};

const MOOD_DECORATIONS: Record<MascotMood, string[]> = {
    idle: [],
    happy: ['✨'],
    excited: ['⭐', '✨', '💫'],
    thinking: ['💭'],
    sad: ['💧'],
    encouraging: ['💪', '✨'],
    celebrating: ['🎉', '🎊', '✨'],
    sleeping: ['💤'],
};

const MOOD_MESSAGES: Record<MascotMood, string[]> = {
    idle: ['准备好了吗？', '一起学习吧！'],
    happy: ['太棒了！', '做得好！', '继续加油！'],
    excited: ['哇！太厉害了！', '你是最棒的！'],
    thinking: ['嗯...让我想想', '仔细看看...'],
    sad: ['没关系，再试一次！', '不要放弃！'],
    encouraging: ['加油！你可以的！', '相信自己！'],
    celebrating: ['你做到了！', '恭喜恭喜！'],
    sleeping: ['zzz...', '休息一下...'],
};

export const Mascot: React.FC<MascotProps> = ({
    mood,
    message,
    size = 'md',
    showBubble = true
}) => {
    const expression = MASCOT_EXPRESSIONS[mood];
    const decorations = MOOD_DECORATIONS[mood];
    const defaultMessage = MOOD_MESSAGES[mood][Math.floor(Math.random() * MOOD_MESSAGES[mood].length)];

    return (
        <div className={`mascot size-${size} mood-${mood}`}>
            {/* Decorations */}
            <div className="mascot-decorations">
                <AnimatePresence>
                    {decorations.map((deco, i) => (
                        <motion.span
                            key={`${deco}-${i}`}
                            className="decoration"
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1, 1, 0.5],
                                y: [-20 * (i + 1)],
                                x: (i - decorations.length / 2) * 20
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity
                            }}
                        >
                            {deco}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {/* Mascot body */}
            <motion.div
                className={`mascot-body animation-${expression.animation}`}
                animate={
                    mood === 'excited' ? {
                        y: [0, -10, 0],
                        rotate: [0, -5, 5, 0]
                    } : mood === 'happy' ? {
                        y: [0, -5, 0],
                        rotate: [0, 2, -2, 0]
                    } : mood === 'celebrating' ? {
                        y: [0, -15, 0],
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                    } : mood === 'sad' ? {
                        y: [0, 2, 0]
                    } : mood === 'sleeping' ? {
                        y: [0, 2, 0],
                        rotate: [0, 5, 0]
                    } : mood === 'thinking' ? {
                        rotate: [0, 5, 0, -5, 0]
                    } : {}
                }
                transition={{
                    duration: mood === 'excited' ? 0.5 : mood === 'celebrating' ? 0.6 : 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                <span className="mascot-emoji">{expression.emoji}</span>

                {/* Eyes overlay based on mood */}
                <div className="mascot-eyes">
                    {mood === 'happy' || mood === 'excited' || mood === 'celebrating' ? (
                        <span className="eyes-happy">◠◡◠</span>
                    ) : mood === 'sad' ? (
                        <span className="eyes-sad">╥﹏╥</span>
                    ) : mood === 'sleeping' ? (
                        <span className="eyes-sleeping">－︿－</span>
                    ) : mood === 'thinking' ? (
                        <span className="eyes-thinking">◔_◔</span>
                    ) : null}
                </div>
            </motion.div>

            {/* Speech bubble */}
            {showBubble && (
                <motion.div
                    className="speech-bubble"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    key={message || defaultMessage}
                >
                    {message || defaultMessage}
                </motion.div>
            )}
        </div>
    );
};

export default Mascot;
