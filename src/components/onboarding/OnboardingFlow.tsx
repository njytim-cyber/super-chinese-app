import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HanziWriter from 'hanzi-writer';
import confetti from 'canvas-confetti';
import { Button } from '../ui';
import { XPPopup } from '../game';
import { useGameStore } from '../../stores';
import { ONBOARDING_CHARACTERS } from '../../types';
import './OnboardingFlow.css';

// Success sounds (using Web Audio API for different tones)
const playSuccessSound = (index: number) => {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Different frequencies for each character (ascending happy tones)
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    oscillator.frequency.value = frequencies[index] || 523.25;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
};

// Confetti configurations for escalating celebration
const confettiConfigs = [
    { particleCount: 30, spread: 50, origin: { y: 0.6 } },
    { particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#ff6b6b', '#ffd93d', '#6bcb77'] },
    { particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'] },
    {
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6'],
        startVelocity: 45,
        gravity: 0.8
    },
];

// Encouragement messages (escalating)
const encouragementKeys = [
    'onboarding.amazing',
    'onboarding.excellent',
    'onboarding.fantastic',
    'onboarding.incredible',
];

interface OnboardingFlowProps {
    onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { t } = useTranslation();
    const { addXP, updateStreak, addCharacterLearned, completeOnboarding } = useGameStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'intro' | 'demo' | 'practice' | 'success' | 'complete'>('intro');
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [xpAmount, setXpAmount] = useState(0);
    const [encouragement, setEncouragement] = useState('');

    const writerContainerRef = useRef<HTMLDivElement>(null);
    const writerRef = useRef<HanziWriter | null>(null);

    const currentCharacter = ONBOARDING_CHARACTERS[currentIndex];
    const isLastCharacter = currentIndex === ONBOARDING_CHARACTERS.length - 1;

    // XP rewards escalate
    const xpRewards = [10, 15, 20, 30];

    const initWriter = useCallback((mode: 'demo' | 'quiz') => {
        if (!writerContainerRef.current || !currentCharacter) return;

        // Clear previous writer
        writerContainerRef.current.innerHTML = '';

        writerRef.current = HanziWriter.create(writerContainerRef.current, currentCharacter.character, {
            width: 280,
            height: 280,
            padding: 20,
            strokeColor: '#8b5cf6',
            radicalColor: '#a78bfa',
            outlineColor: '#3a3a5c',
            drawingColor: '#f43f5e',
            showOutline: true,
            showCharacter: mode === 'demo',
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 300,
        });

        if (mode === 'demo') {
            writerRef.current.animateCharacter({
                onComplete: () => {
                    setTimeout(() => setPhase('practice'), 500);
                }
            });
        } else {
            writerRef.current.quiz({
                onComplete: () => {
                    handleCharacterComplete();
                },
            });
        }
    }, [currentCharacter]);

    useEffect(() => {
        if (phase === 'demo') {
            initWriter('demo');
        } else if (phase === 'practice') {
            initWriter('quiz');
        }

        return () => {
            if (writerRef.current) {
                writerRef.current = null;
            }
        };
    }, [phase, initWriter]);

    const handleCharacterComplete = () => {
        // Play success sound
        playSuccessSound(currentIndex);

        // Fire confetti
        confetti(confettiConfigs[currentIndex]);

        // Add XP
        const reward = xpRewards[currentIndex];
        setXpAmount(reward);
        addXP({ type: 'character_complete', amount: reward, timestamp: new Date() });

        // Update streak on first character
        if (currentIndex === 0) {
            updateStreak();
        }

        // Add character to learned
        addCharacterLearned(currentCharacter.character);

        // Set encouragement
        setEncouragement(t(encouragementKeys[currentIndex]));

        // Show success
        setPhase('success');
        setShowXPPopup(true);
    };

    const handleNext = () => {
        setShowXPPopup(false);

        if (isLastCharacter) {
            setPhase('complete');
        } else {
            setCurrentIndex(prev => prev + 1);
            setPhase('demo');
        }
    };

    const handleFinish = () => {
        completeOnboarding();
        onComplete();
    };

    const handleStart = () => {
        setPhase('demo');
    };

    return (
        <div className="onboarding-container">
            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        className="onboarding-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="onboarding-emoji"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🐼
                        </motion.div>
                        <h1 className="onboarding-title">{t('onboarding.welcome')}</h1>
                        <p className="onboarding-subtitle">{t('onboarding.letsStart')}</p>
                        <Button size="lg" onClick={handleStart}>
                            {t('common.continue')}
                        </Button>
                    </motion.div>
                )}

                {(phase === 'demo' || phase === 'practice') && (
                    <motion.div
                        key="writing"
                        className="onboarding-screen"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="onboarding-progress">
                            {ONBOARDING_CHARACTERS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`progress-dot ${i < currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="character-info">
                            <span className="character-pinyin">{currentCharacter.pinyin}</span>
                            <span className="character-meaning">{currentCharacter.meaning}</span>
                        </div>

                        <motion.div
                            className="writer-container"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            <div ref={writerContainerRef} className="hanzi-writer" />
                        </motion.div>

                        <p className="onboarding-hint">
                            {phase === 'demo' ? t('onboarding.watchFirst') : t('onboarding.yourTurn')}
                        </p>
                    </motion.div>
                )}

                {phase === 'success' && (
                    <motion.div
                        key="success"
                        className="onboarding-screen"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="success-character"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            {currentCharacter.character}
                        </motion.div>

                        <motion.h2
                            className="success-message"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {encouragement}
                        </motion.h2>

                        <XPPopup amount={xpAmount} show={showXPPopup} />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button size="lg" onClick={handleNext}>
                                {isLastCharacter ? t('onboarding.complete') : t('onboarding.nextCharacter')}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        className="onboarding-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="complete-characters"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                        >
                            {ONBOARDING_CHARACTERS.map((char, i) => (
                                <motion.span
                                    key={char.character}
                                    className="complete-char"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {char.character}
                                </motion.span>
                            ))}
                        </motion.div>

                        <h2 className="complete-title">{t('onboarding.complete')}</h2>
                        <p className="complete-subtitle">
                            {t('onboarding.youLearned')} {ONBOARDING_CHARACTERS.length} {t('onboarding.characters')}!
                        </p>

                        <Button size="lg" variant="success" onClick={handleFinish}>
                            {t('onboarding.continueToApp')}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
