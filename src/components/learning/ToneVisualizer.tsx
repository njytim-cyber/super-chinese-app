/**
 * Tone Visualizer Component
 * Displays pitch contours for Mandarin tones with target vs user comparison
 * Uses Web Audio API for real-time pitch analysis
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ToneVisualizer.css';

interface ToneVisualizerProps {
    targetPinyin: string; // e.g., "ma1" or "mā"
    onResult?: (success: boolean, accuracy: number) => void;
    autoStart?: boolean;
}

// Tone contours as percentage of pitch range [start%, end%] or intermediate points
const TONE_CONTOURS: Record<number, number[]> = {
    1: [85, 85, 85, 85], // High level (Tone 1)
    2: [50, 55, 70, 90], // Rising (Tone 2)
    3: [60, 45, 35, 55], // Dipping (Tone 3)
    4: [90, 70, 45, 25], // Falling (Tone 4)
    5: [50, 50, 50, 50], // Neutral/light (Tone 5)
};

const TONE_NAMES = {
    1: '阴平 (High Level)',
    2: '阳平 (Rising)',
    3: '上声 (Dipping)',
    4: '去声 (Falling)',
    5: '轻声 (Neutral)',
};

// Extract tone number from pinyin
function extractTone(pinyin: string): number {
    // Check for tone marks (ā á ǎ à)
    const toneMarks: Record<string, number> = {
        'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
        'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
        'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
        'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
    };

    for (const char of pinyin) {
        if (toneMarks[char]) return toneMarks[char];
    }

    // Check for numeric tone at end (ma1, ma2, etc.)
    const match = pinyin.match(/(\d)$/);
    if (match) return parseInt(match[1]) || 5;

    return 5; // Default neutral
}

export const ToneVisualizer: React.FC<ToneVisualizerProps> = ({
    targetPinyin,
    onResult
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [pitchData, setPitchData] = useState<number[]>([]);
    const [result, setResult] = useState<{ success: boolean; accuracy: number } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const toneNumber = extractTone(targetPinyin);
    const targetContour = TONE_CONTOURS[toneNumber] || TONE_CONTOURS[5];

    // Draw the visualization
    const drawVisualization = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw target contour
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.6)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        targetContour.forEach((point, i) => {
            const x = (i / (targetContour.length - 1)) * width;
            const y = height - (point / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw target contour solid
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        targetContour.forEach((point, i) => {
            const x = (i / (targetContour.length - 1)) * width;
            const y = height - (point / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw user pitch data
        if (pitchData.length > 1) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            pitchData.forEach((point, i) => {
                const x = (i / (pitchData.length - 1)) * width;
                const y = height - (point / 100) * height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }

    }, [targetContour, pitchData]);

    useEffect(() => {
        drawVisualization();
    }, [drawVisualization]);

    // Pitch detection using autocorrelation
    const detectPitch = (dataArray: Float32Array, sampleRate: number): number | null => {
        const bufferLength = dataArray.length;
        let rms = 0;
        for (let i = 0; i < bufferLength; i++) {
            rms += dataArray[i] * dataArray[i];
        }
        rms = Math.sqrt(rms / bufferLength);

        if (rms < 0.01) return null; // Too quiet

        // Autocorrelation
        const correlations = new Array(bufferLength).fill(0);
        for (let lag = 0; lag < bufferLength; lag++) {
            for (let i = 0; i < bufferLength - lag; i++) {
                correlations[lag] += dataArray[i] * dataArray[i + lag];
            }
        }

        // Find first peak after initial decline
        let peakLag = 0;
        let peakValue = -Infinity;
        const minLag = Math.floor(sampleRate / 500); // Max 500 Hz
        const maxLag = Math.floor(sampleRate / 75);  // Min 75 Hz

        for (let lag = minLag; lag < Math.min(maxLag, correlations.length); lag++) {
            if (correlations[lag] > peakValue) {
                peakValue = correlations[lag];
                peakLag = lag;
            }
        }

        if (peakLag === 0) return null;

        const frequency = sampleRate / peakLag;
        return frequency;
    };

    // Convert frequency to normalized pitch (0-100)
    const frequencyToPitch = (freq: number): number => {
        // Typical speaking range: 85-350 Hz
        const minFreq = 85;
        const maxFreq = 350;
        const normalized = ((freq - minFreq) / (maxFreq - minFreq)) * 100;
        return Math.max(0, Math.min(100, normalized));
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            source.connect(analyser);

            setIsRecording(true);
            setPitchData([]);
            setResult(null);

            const bufferLength = analyser.fftSize;
            const dataArray = new Float32Array(bufferLength);
            const pitchPoints: number[] = [];

            const analyze = () => {
                if (!isRecording) return;

                analyser.getFloatTimeDomainData(dataArray);
                const pitch = detectPitch(dataArray, audioContext.sampleRate);

                if (pitch) {
                    pitchPoints.push(frequencyToPitch(pitch));
                    setPitchData([...pitchPoints]);
                }

                animationFrameRef.current = requestAnimationFrame(analyze);
            };

            analyze();

            // Auto-stop after 2 seconds
            setTimeout(() => {
                stopRecording(pitchPoints);
            }, 2000);

        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };

    // Stop recording and calculate accuracy
    const stopRecording = (finalPitchData?: number[]) => {
        setIsRecording(false);

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        const data = finalPitchData || pitchData;
        if (data.length > 0) {
            // Calculate accuracy by comparing with target contour
            const accuracy = calculateAccuracy(data, targetContour);
            const success = accuracy >= 70;
            setResult({ success, accuracy });
            onResult?.(success, accuracy);
        }
    };

    // Calculate accuracy between user and target
    const calculateAccuracy = (userData: number[], targetData: number[]): number => {
        if (userData.length < 2) return 0;

        // Normalize user data to same length as target
        const normalized: number[] = [];
        for (let i = 0; i < targetData.length; i++) {
            const idx = Math.floor((i / (targetData.length - 1)) * (userData.length - 1));
            normalized.push(userData[idx]);
        }

        // Calculate difference
        let totalDiff = 0;
        for (let i = 0; i < targetData.length; i++) {
            totalDiff += Math.abs(normalized[i] - targetData[i]);
        }

        const avgDiff = totalDiff / targetData.length;
        const accuracy = Math.max(0, 100 - avgDiff);
        return Math.round(accuracy);
    };

    return (
        <div className="tone-visualizer">
            <div className="tone-header">
                <span className="tone-label">
                    Tone {toneNumber}: {TONE_NAMES[toneNumber as keyof typeof TONE_NAMES]}
                </span>
                <span className="pinyin-display">{targetPinyin}</span>
            </div>

            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={280}
                    height={120}
                    className="tone-canvas"
                />

                <div className="legend">
                    <span className="legend-target">— Target</span>
                    <span className="legend-user">— Your Voice</span>
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        className={`result-badge ${result.success ? 'success' : 'retry'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {result.success ? '✓ ' : '↻ '}
                        {result.accuracy}% Accuracy
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                className={`record-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? () => stopRecording() : startRecording}
            >
                {isRecording ? (
                    <>🎙️ Recording...</>
                ) : (
                    <>🎤 Record Tone</>
                )}
            </button>
        </div>
    );
};

export default ToneVisualizer;
