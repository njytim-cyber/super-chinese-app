import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { XPPopup } from '../game';
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

type Phase = 'demo' | 'practice' | 'success' | 'complete';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { t } = useTranslation();
    const { addXP, updateStreak, addCharacterLearned, completeOnboarding } = useGameStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('demo');
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [xpAmount, setXpAmount] = useState(0);
    const [encouragement, setEncouragement] = useState('');
    const [showHandGuide, setShowHandGuide] = useState(false);
    const [writerKey, setWriterKey] = useState(0); // Force remount on character change

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

    // Handle character successfully written
    const handlePracticeComplete = useCallback(() => {
        // Celebration
        playSuccessSound(currentIndex);
        fireConfetti(currentIndex);

        // Speak character for reinforcement
        setTimeout(() => speakChinese(currentCharacter.character), 300);

        // Award XP
        const reward = XP_REWARDS[currentIndex] ?? 10;
        setXpAmount(reward);
        addXP({ type: 'character_complete', amount: reward, timestamp: new Date() });

        // Start streak on first character
        if (currentIndex === 0) {
            updateStreak();
        }

        // Record learned character
        addCharacterLearned(currentCharacter.character);

        // Show encouragement
        setEncouragement(t(ENCOURAGEMENT_KEYS[currentIndex] ?? ENCOURAGEMENT_KEYS[0]));

        // Transition to success
        setPhase('success');
        setShowXPPopup(true);
        setShowHandGuide(false);
    }, [currentIndex, currentCharacter, addXP, updateStreak, addCharacterLearned, t]);

    // Handle first correct stroke
    const handleCorrectStroke = useCallback(() => {
        setShowHandGuide(false);
    }, []);

    // Proceed to next character or completion
    const handleNext = useCallback(() => {
        setShowXPPopup(false);

        if (isLastCharacter) {
            fireGrandConfetti();
            setPhase('complete');
        } else {
            setCurrentIndex(i => i + 1);
            setPhase('demo');
            setWriterKey(k => k + 1);
        }
    }, [isLastCharacter]);

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
            <AnimatePresence mode="wait">
                {/* Writing Phase (Demo & Practice) */}
                {(phase === 'demo' || phase === 'practice') && (
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
                        {/* Progress dots */}
                        <div className="onboarding-progress">
                            {ONBOARDING_CHARACTERS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`progress-dot ${i < currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>

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
                                onComplete={phase === 'demo' ? handleDemoComplete : handlePracticeComplete}
                                onCorrectStroke={handleCorrectStroke}
                            />
                            <AnimatedHand show={showHandGuide} />
                        </motion.div>

                        {/* Hint text */}
                        <p className="onboarding-hint">
                            {phase === 'demo' ? t('onboarding.watchFirst') : t('onboarding.yourTurn')}
                        </p>
                    </motion.div>
                )}

                {/* Success Phase */}
                {phase === 'success' && (
                    <motion.div
                        key="success"
                        className="onboarding-screen"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="success-character-container"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <span className="success-character">{currentCharacter.character}</span>
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
