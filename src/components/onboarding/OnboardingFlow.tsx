import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button, AnimatedHand, CelebrationOverlay } from '../ui';
import { CharacterWriter } from '../learning';
import { LevelDetermination } from './LevelDetermination';
import { OnboardingHUD } from './OnboardingHUD';
import { SettingsModal } from '../settings/SettingsModal'; // Direct import or via barrel if ready
import { useGameStore, useUserStore } from '../../stores';
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

type Phase = 'demo' | 'practice' | 'celebrating' | 'complete' | 'level_determination';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { t } = useTranslation();
    const { addXP, updateStreak, addCharacterLearned, completeOnboarding } = useGameStore();
    useUserStore(); // Store subscription maintained for reactivity

    // Guard against multiple completions
    const processingRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('demo');

    // Debug logging
    useEffect(() => {
        console.log('State Update:', { currentIndex, phase, char: ONBOARDING_CHARACTERS[currentIndex]?.character });
        processingRef.current = false; // Reset guard on index change
    }, [currentIndex, phase]);
    const [showHandGuide, setShowHandGuide] = useState(false);
    const [writerKey, setWriterKey] = useState(0);
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    // Progressive HUD reveal
    const [showXP, setShowXP] = useState(false);
    const [showStreak, setShowStreak] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false); // Settings modal state
    const showSettingsButton = true; // Settings button always visible

    const currentCharacter = useMemo(
        () => ONBOARDING_CHARACTERS[currentIndex],
        [currentIndex]
    );
    const isLastCharacter = currentIndex === ONBOARDING_CHARACTERS.length - 1;

    // Handle demo animation complete - defined before conditional return
    const handleDemoComplete = useCallback(() => {
        setShowHandGuide(false);
        setPhase('practice');
        setWriterKey(k => k + 1);
    }, []);

    // Handle character successfully written - quick celebration then advance
    const handlePracticeComplete = useCallback(() => {
        if (processingRef.current) {
            console.warn('Duplicate completion detected for index:', currentIndex);
            return;
        }
        processingRef.current = true;
        console.log('Processing completion for index:', currentIndex);

        // Celebration effects
        playSuccessSound(currentIndex);
        fireConfetti(currentIndex);

        // Speak character for reinforcement
        if (currentCharacter) {
            speakChinese(currentCharacter.character);
            addCharacterLearned(currentCharacter.character);
        }

        // Award XP
        const reward = XP_REWARDS[currentIndex] ?? 10;
        addXP({ type: 'character_complete', amount: reward, timestamp: new Date() });

        // Start streak on first character
        if (currentIndex === 0) {
            updateStreak();
        }

        // Show celebration overlay
        setCelebrationMessage(t(ENCOURAGEMENT_KEYS[currentIndex] ?? ENCOURAGEMENT_KEYS[0]));
        setShowCelebration(true);
        setPhase('celebrating');
        setShowHandGuide(false);

        // Progressive HUD reveal:
        // - After 1st char (0): Reveal XP (Right)
        // - After 2nd char (1): Reveal Streak (Right, next to XP)
        // - After 3rd char (2): Reveal Profile (Left)
        if (currentIndex === 0) {
            setTimeout(() => setShowXP(true), 400);
        } else if (currentIndex === 1) {
            setTimeout(() => setShowStreak(true), 400);
        } else if (currentIndex === 2) {
            setTimeout(() => setShowProfile(true), 400);
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
        if (currentCharacter) {
            speakChinese(currentCharacter.character);
        }
        setShowHandGuide(true);
    }, [currentCharacter]);

    // When entering practice mode, show hand guide
    const handlePracticeStart = useCallback(() => {
        setShowHandGuide(true);
    }, []);

    // Safety check - after all hooks
    if (!currentCharacter && phase !== 'complete' && phase !== 'level_determination') {
        console.error('Invalid character index:', currentIndex);
        return <div className="p-4 text-red-500">Error: Character not found</div>;
    }

    return (
        <div className="onboarding-container">
            {/* HUD with progressive reveal */}
            <OnboardingHUD
                showProfile={showProfile}
                showStreak={showStreak}
                showXP={showXP}
                showSettingsButton={showSettingsButton}
                onSettingsClick={() => setShowSettings(true)}
            />

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>

            {/* Celebration overlay */}
            <CelebrationOverlay message={celebrationMessage} show={showCelebration} />

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
                        {/* Removed 'You learned X characters' text */}

                        <Button size="lg" variant="success" onClick={handleFinish}>
                            {t('onboarding.continueToApp')}
                        </Button>
                    </motion.div>
                )}

                {phase === 'level_determination' && (
                    <motion.div
                        key="level-determination"
                        className="onboarding-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <LevelDetermination onComplete={() => { /* no-op or handled? */ }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
