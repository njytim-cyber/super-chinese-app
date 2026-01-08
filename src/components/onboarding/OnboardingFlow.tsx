import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { XPDisplay, StreakCounter } from '../game';
import { CharacterWriter } from '../learning';
import { useGameStore } from '../../stores';
import { ONBOARDING_CHARACTERS } from '../../types';
import { playSuccessSound, speakChinese, fireConfetti, fireGrandConfetti } from '../../utils';
import './OnboardingFlow.css';

// Encouragement message keys (escalating)
const ENCOURAGEMENT_KEYS = [
    'onboarding.amazing',
    'onboarding.excellent',
    'onboarding.fantastic',
    'onboarding.incredible',
] as const;

// XP rewards (escalating)
const XP_REWARDS = [10, 15, 20, 30] as const;

interface OnboardingFlowProps {
    onComplete: () => void;
}

// Animated hand component for swipe guide
function AnimatedHand({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <motion.div
            className="animated-hand"
            initial={{ opacity: 0, x: -60 }}
            animate={{
                opacity: [0, 1, 1, 0],
                x: [-60, 60],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut',
            }}
        >
            <span className="hand-emoji">👆</span>
        </motion.div>
    );
}

// Celebration overlay that appears briefly
function CelebrationOverlay({ message, show }: { message: string; show: boolean }) {
    if (!show) return null;

    return (
        <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
        >
            <motion.span
                className="celebration-text"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
            >
                {message}
            </motion.span>
        </motion.div>
    );
}

type Phase = 'demo' | 'practice' | 'celebrating' | 'complete';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { t } = useTranslation();
    const { addXP, updateStreak, addCharacterLearned, completeOnboarding } = useGameStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('demo');
    const [showHandGuide, setShowHandGuide] = useState(false);
    const [writerKey, setWriterKey] = useState(0);
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    // Progressive HUD reveal
    const [showXP, setShowXP] = useState(false);
    const [showStreak, setShowStreak] = useState(false);
    const [showAvatar, setShowAvatar] = useState(false);

    const currentCharacter = useMemo(
        () => ONBOARDING_CHARACTERS[currentIndex],
        [currentIndex]
    );
    const isLastCharacter = currentIndex === ONBOARDING_CHARACTERS.length - 1;

    // Handle demo animation complete
    const handleDemoComplete = useCallback(() => {
        setShowHandGuide(false);
        setPhase('practice');
        setWriterKey(k => k + 1);
    }, []);

    // Handle character successfully written - quick celebration then advance
    const handlePracticeComplete = useCallback(() => {
        // Celebration effects
        playSuccessSound(currentIndex);
        fireConfetti(currentIndex);

        // Speak character for reinforcement
        speakChinese(currentCharacter.character);

        // Award XP
        const reward = XP_REWARDS[currentIndex] ?? 10;
        addXP({ type: 'character_complete', amount: reward, timestamp: new Date() });

        // Start streak on first character
        if (currentIndex === 0) {
            updateStreak();
        }

        // Record learned character
        addCharacterLearned(currentCharacter.character);

        // Show celebration overlay
        setCelebrationMessage(t(ENCOURAGEMENT_KEYS[currentIndex] ?? ENCOURAGEMENT_KEYS[0]));
        setShowCelebration(true);
        setPhase('celebrating');
        setShowHandGuide(false);

        // Progressive HUD reveal:
        // - After 1st char (0): Reveal XP (Right)
        // - After 2nd char (1): Reveal Streak (Left)
        // - After 3rd char (2): Reveal Avatar (Right, next to XP)
        if (currentIndex === 0) {
            setTimeout(() => setShowXP(true), 400);
        } else if (currentIndex === 1) {
            setTimeout(() => setShowStreak(true), 400);
        } else if (currentIndex === 2) {
            setTimeout(() => setShowAvatar(true), 400);
        }

        // Auto-advance after brief celebration
        setTimeout(() => {
            setShowCelebration(false);

            if (isLastCharacter) {
                fireGrandConfetti();
                setPhase('complete');
            } else {
                // Move to next character
                setCurrentIndex(i => i + 1);
                setPhase('demo');
                setWriterKey(k => k + 1);
            }
        }, 1200);
    }, [currentIndex, currentCharacter, addXP, updateStreak, addCharacterLearned, t, isLastCharacter]);

    // Handle first correct stroke
    const handleCorrectStroke = useCallback(() => {
        setShowHandGuide(false);
    }, []);

    // Finish onboarding
    const handleFinish = useCallback(() => {
        completeOnboarding();
        onComplete();
    }, [completeOnboarding, onComplete]);

    // Trigger speech and hand guide when demo starts
    const handleDemoStart = useCallback(() => {
        speakChinese(currentCharacter.character);
        setShowHandGuide(true);
    }, [currentCharacter]);

    // When entering practice mode, show hand guide
    const handlePracticeStart = useCallback(() => {
        setShowHandGuide(true);
    }, []);

    return (
        <div className="onboarding-container">
            {/* HUD with progressive reveal */}
            <div className="onboarding-hud">
                <div className="hud-left">
                    <AnimatePresence>
                        {showStreak && (
                            <motion.div
                                key="streak"
                                className="hud-item"
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <StreakCounter size="sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hud-right">
                    <AnimatePresence>
                        {showXP && (
                            <motion.div
                                key="xp"
                                className="hud-item"
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <XPDisplay size="sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showAvatar && (
                            <motion.div
                                key="avatar"
                                className="hud-item hud-avatar"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="avatar-circle">🐼</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Celebration overlay */}
            <AnimatePresence>
                <CelebrationOverlay message={celebrationMessage} show={showCelebration} />
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {/* Writing Phase (Demo, Practice, Celebrating) */}
                {(phase === 'demo' || phase === 'practice' || phase === 'celebrating') && (
                    <motion.div
                        key={`writing-${currentIndex}`}
                        className="onboarding-screen"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onAnimationComplete={() => {
                            if (phase === 'demo') handleDemoStart();
                            if (phase === 'practice') handlePracticeStart();
                        }}
                    >
                        {/* Character info */}
                        <div className="character-info">
                            <span className="character-pinyin">{currentCharacter.pinyin}</span>
                            <span className="character-meaning">{currentCharacter.meaning}</span>
                        </div>

                        {/* HanziWriter */}
                        <motion.div
                            className="writer-container"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            <CharacterWriter
                                key={`${currentCharacter.character}-${writerKey}`}
                                character={currentCharacter.character}
                                mode={phase === 'demo' ? 'demo' : 'quiz'}
                                size={280}
                                onComplete={phase === 'demo' ? handleDemoComplete : (phase === 'practice' ? handlePracticeComplete : undefined)}
                                onCorrectStroke={handleCorrectStroke}
                                autoStart={phase !== 'celebrating'}
                            />
                            <AnimatedHand show={showHandGuide && phase === 'practice'} />
                        </motion.div>

                        {/* Progress dots */}
                        <div className="onboarding-progress" style={{ marginTop: '1rem' }}>
                            {ONBOARDING_CHARACTERS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`progress-dot ${i < currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Complete Phase */}
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
