import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { CharacterWriter } from '../learning';
import { LevelDetermination } from './LevelDetermination';
import { useGameStore, useUserStore } from '../../stores';
import { LanguageSelector } from '../settings/LanguageSelector';
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

function SettingsModal({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { preferences, setTheme } = useUserStore();

    return (
        <motion.div
            className="settings-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <motion.div
                className="settings-modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)', padding: '2rem', borderRadius: '1.5rem',
                    width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
            >
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('settings.title')}</h2>

                {/* Theme */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.8 }}>{t('settings.theme')}</h3>
                    <div className="theme-options" style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['light', 'dark', 'system'] as const).map(theme => (
                            <button
                                key={theme}
                                className={`theme-option ${preferences.theme === theme ? 'active' : ''}`}
                                onClick={() => setTheme(theme)}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '0.5rem',
                                    border: `2px solid ${preferences.theme === theme ? 'var(--primary)' : 'var(--border)'}`,
                                    background: 'var(--bg-card-hover)', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>
                                    {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                                </span>
                                <span style={{ fontSize: '0.8rem' }}>{t(`settings.${theme}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.8 }}>{t('settings.language')}</h3>
                    <LanguageSelector variant="grid" />
                </div>

                <Button fullWidth onClick={onClose} variant="primary">
                    {t('common.done')}
                </Button>
            </motion.div>
        </motion.div>
    );
}

type Phase = 'demo' | 'practice' | 'celebrating' | 'complete' | 'level_determination';

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
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false); // Settings modal state
    const [showSettingsButton, setShowSettingsButton] = useState(true); // Settings button visibility (always visible at start)

    // Get store data for HUD
    const { totalXP, streak, currentLevel } = useGameStore();

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
        // completeOnboarding(); // Moved to after level determination
        setPhase('level_determination');
    }, []);

    const handleLevelDeterminationComplete = useCallback(() => {
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
                        {showProfile && (
                            <motion.div
                                key="profile"
                                className="hud-pill profile-pill"
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className="profile-avatar">🐼</span>
                                {/* <span className="pill-value">Lvl {currentLevel}</span> */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hud-right">
                    <AnimatePresence>
                        {showStreak && (
                            <motion.div
                                key="streak"
                                className="hud-pill"
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className="pill-icon">🔥</span>
                                <span className="pill-value pill-highlight">{streak.currentStreak}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showXP && (
                            <motion.div
                                key="xp"
                                className="hud-pill"
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className="pill-icon" style={{ color: '#fbbf24' }}>⭐</span>
                                <span className="pill-value pill-highlight">{totalXP} XP</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Settings Button - Right of XP */}
                    <AnimatePresence>
                        {showSettingsButton && (
                            <motion.button
                                key="settings-btn"
                                className="hud-icon-btn"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setShowSettings(true)}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'var(--bg-card)', border: '2px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', marginLeft: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>

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
                        {/* Removed 'You learned X characters' text */}

                        <Button size="lg" variant="success" onClick={handleFinish}>
                            {t('onboarding.continueToApp')}
                        </Button>
                    </motion.div>
                )}

                {/* Level Determination Phase */}
                {phase === 'level_determination' && (
                    <motion.div
                        key="level-determination"
                        className="onboarding-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <LevelDetermination onComplete={handleLevelDeterminationComplete} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
