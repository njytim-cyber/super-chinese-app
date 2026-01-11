/**
 * Audio Player Component
 * Reusable audio player with speed control for Chinese pronunciation
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakChinese } from '../../utils/audio';
import './AudioPlayer.css';

interface AudioPlayerProps {
    /** Audio URL or Chinese text (uses Web Speech API if no URL) */
    src?: string;
    /** Chinese text to speak if no audio URL */
    text?: string;
    /** Playback speed options */
    speeds?: number[];
    /** Show speed controls */
    showSpeedControls?: boolean;
    /** Compact mode for inline use */
    compact?: boolean;
    /** Callback when playback ends */
    onEnded?: () => void;
}

const DEFAULT_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    src,
    text,
    speeds = DEFAULT_SPEEDS,
    showSpeedControls = true,
    compact = false,
    onEnded
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showSpeeds, setShowSpeeds] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = useCallback(() => {
        if (src) {
            // Use audio file
            if (!audioRef.current) {
                audioRef.current = new Audio(src);
                audioRef.current.onended = () => {
                    setIsPlaying(false);
                    onEnded?.();
                };
            }
            audioRef.current.playbackRate = speed;
            audioRef.current.play();
            setIsPlaying(true);
        } else if (text) {
            // Use Web Speech API
            setIsPlaying(true);
            speakChinese(text, speed).then(() => {
                setIsPlaying(false);
                onEnded?.();
            });
        }
    }, [src, text, speed, onEnded]);

    const handleStop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        window.speechSynthesis?.cancel();
        setIsPlaying(false);
    }, []);

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        setShowSpeeds(false);
        if (audioRef.current) {
            audioRef.current.playbackRate = newSpeed;
        }
    };

    if (compact) {
        return (
            <motion.button
                className="audio-player-compact"
                onClick={isPlaying ? handleStop : handlePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? 'Stop' : 'Play pronunciation'}
            >
                {isPlaying ? '⏹️' : '🔊'}
            </motion.button>
        );
    }

    return (
        <div className="audio-player">
            <motion.button
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={isPlaying ? handleStop : handlePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="play-icon">{isPlaying ? '⏹️' : '▶️'}</span>
                <span className="play-text">{isPlaying ? '停止' : '播放'}</span>
            </motion.button>

            {showSpeedControls && (
                <div className="speed-control">
                    <button
                        className="speed-button"
                        onClick={() => setShowSpeeds(!showSpeeds)}
                    >
                        {speed}x
                    </button>
                    <AnimatePresence>
                        {showSpeeds && (
                            <motion.div
                                className="speed-dropdown"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {speeds.map(s => (
                                    <button
                                        key={s}
                                        className={`speed-option ${s === speed ? 'active' : ''}`}
                                        onClick={() => handleSpeedChange(s)}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <motion.button
                className="repeat-button"
                onClick={handlePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="重复"
            >
                🔁
            </motion.button>
        </div>
    );
};

export default AudioPlayer;
