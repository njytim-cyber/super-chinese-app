/**
 * Stroke Animator Component
 * Animated stroke-by-stroke character demonstration using HanziWriter
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import HanziWriter from 'hanzi-writer';
import './StrokeAnimator.css';

interface StrokeAnimatorProps {
    /** Chinese character to animate */
    character: string;
    /** Size of the canvas in pixels */
    size?: number;
    /** Stroke color */
    strokeColor?: string;
    /** Animation speed (1 = normal) */
    speed?: number;
    /** Auto-play on mount */
    autoPlay?: boolean;
    /** Show stroke numbers */
    showNumbers?: boolean;
    /** Callback after animation completes */
    onComplete?: () => void;
}

export const StrokeAnimator: React.FC<StrokeAnimatorProps> = ({
    character,
    size = 200,
    strokeColor = '#4a90d9',
    speed = 1,
    autoPlay = false,
    showNumbers = false,
    onComplete
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const writerRef = useRef<HanziWriter | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStroke, setCurrentStroke] = useState(0);
    const [totalStrokes, setTotalStrokes] = useState(0);

    // Initialize HanziWriter
    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous writer
        containerRef.current.innerHTML = '';
        writerRef.current = null;

        try {
            const writer = HanziWriter.create(containerRef.current, character, {
                width: size,
                height: size,
                padding: 10,
                strokeColor: strokeColor,
                radicalColor: '#166534',
                delayBetweenStrokes: 300 / speed,
                strokeAnimationSpeed: 1 * speed,
                showCharacter: false,
                showOutline: true,
                outlineColor: 'rgba(255, 255, 255, 0.15)'
            });

            writerRef.current = writer;

            // Get stroke count
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            HanziWriter.loadCharacterData(character).then((data: any) => {
                if (!data) {
                    setTotalStrokes(0);
                    return;
                }
                setTotalStrokes(data.strokes.length);

                // Handle autoplay after data loads to ensure correct state
                if (autoPlay) {
                    setIsPlaying(true);
                    writer.animateCharacter({
                        onComplete: () => {
                            setIsPlaying(false);
                            // Can't reliably set currentStroke to max here without circular dependency
                            // but visualization will complete anyway
                            onComplete?.();
                        }
                    });
                }
            }).catch(() => {
                setTotalStrokes(0);
            });

        } catch (error) {
            console.error('Failed to initialize HanziWriter:', error);
        }

        return () => {
            writerRef.current = null;
        };
    }, [character, size, strokeColor, speed, autoPlay, onComplete]);

    const animateAll = useCallback(() => {
        if (!writerRef.current) return;

        setIsPlaying(true);
        setCurrentStroke(0);

        writerRef.current.animateCharacter({
            onComplete: () => {
                setIsPlaying(false);
                setCurrentStroke(totalStrokes);
                onComplete?.();
            }
        });
    }, [totalStrokes, onComplete]);

    const animateStep = useCallback(() => {
        if (!writerRef.current || currentStroke >= totalStrokes) return;

        setIsPlaying(true);
        writerRef.current.animateStroke(currentStroke, {
            onComplete: () => {
                setCurrentStroke(prev => prev + 1);
                setIsPlaying(false);
            }
        });
    }, [currentStroke, totalStrokes]);

    const reset = useCallback(() => {
        if (!writerRef.current) return;
        writerRef.current.hideCharacter();
        setCurrentStroke(0);
        setIsPlaying(false);
    }, []);

    return (
        <div className="stroke-animator">
            <div
                ref={containerRef}
                className="stroke-canvas"
                style={{ width: size, height: size }}
            />

            {showNumbers && totalStrokes > 0 && (
                <div className="stroke-progress">
                    <span className="stroke-count">
                        {currentStroke} / {totalStrokes}
                    </span>
                </div>
            )}

            <div className="stroke-controls">
                <motion.button
                    className="stroke-btn"
                    onClick={animateAll}
                    disabled={isPlaying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="播放全部"
                >
                    ▶️ 全部
                </motion.button>

                <motion.button
                    className="stroke-btn"
                    onClick={animateStep}
                    disabled={isPlaying || currentStroke >= totalStrokes}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="下一笔"
                >
                    ➡️ 下一笔
                </motion.button>

                <motion.button
                    className="stroke-btn"
                    onClick={reset}
                    disabled={isPlaying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="重置"
                >
                    🔄
                </motion.button>
            </div>
        </div>
    );
};

export default StrokeAnimator;
