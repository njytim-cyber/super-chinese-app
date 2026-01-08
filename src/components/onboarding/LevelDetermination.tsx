import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
import { CharacterWriter } from '../learning';
import { useGameStore } from '../../stores';
import '../onboarding/OnboardingFlow.css'; // Reusing styles for now

interface LevelDeterminationProps {
    onComplete: () => void;
}

type Step = 'question' | 'write_guided' | 'mcq_english' | 'write_direct' | 'mcq_chinese';

export function LevelDetermination({ onComplete }: LevelDeterminationProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('question');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Direct input state
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [error, setError] = useState('');

    const handleOptionSelect = (option: number) => {
        setSelectedOption(option);
        switch (option) {
            case 1:
                setStep('write_guided');
                break;
            case 2:
                setStep('mcq_english');
                break;
            case 3:
                setStep('write_direct');
                break;
            case 4:
                setStep('mcq_chinese');
                break;
        }
    };

    const handleMcqAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            onComplete();
        } else {
            setError('Try again!'); // Simple error handling for now
            setTimeout(() => setError(''), 1000);
        }
    };

    const handleDirectInputSubmit = () => {
        if (input1.trim() === '十' && input2.trim() === '二') {
            onComplete();
        } else {
            setError('Try again! Hint: 十 二');
        }
    };

    const handleGuidedComplete = () => {
        // After writing both chars? Or just one?
        // Let's assume they write 十 then 二.
        // For simplicity reusing CharacterWriter one by one might be tricky without state.
        // Let's just create a sequence or a simple completion.
        // For now, let's just complete as this is a placeholder for the logic.
        onComplete();
    };

    // Shared container animation
    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="onboarding-container" style={{ paddingTop: '2rem' }}>
            <AnimatePresence mode="wait">
                {step === 'question' && (
                    <motion.div
                        key="question"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="level-determination-screen"
                    >
                        <img src="/eggs.png" alt="12 eggs" style={{ width: '80%', maxWidth: '300px', marginBottom: '1rem', borderRadius: '1rem' }} />
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.levelDetermination.question')}</h2>

                        <div className="options-grid" style={{ display: 'grid', gap: '1rem', width: '100%' }}>
                            <Button variant="outline" onClick={() => handleOptionSelect(1)}>
                                {t('onboarding.levelDetermination.options.option1')}
                            </Button>
                            <Button variant="outline" onClick={() => handleOptionSelect(2)}>
                                {t('onboarding.levelDetermination.options.option2')}
                            </Button>
                            <Button variant="outline" onClick={() => handleOptionSelect(3)}>
                                {t('onboarding.levelDetermination.options.option3')}
                            </Button>
                            <Button variant="outline" onClick={() => handleOptionSelect(4)}>
                                {t('onboarding.levelDetermination.options.option4')}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'mcq_english' && (
                    <motion.div
                        key="mcq_english"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="level-determination-screen"
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.levelDetermination.mcqEnglish')}</h2>
                        <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                            {/* Options: 一 (1), 六 (6), 十二 (12), 八 (8) */}
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>一</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>六</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(true)} style={{ fontSize: '1.5rem' }}>十二</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>八</Button>
                        </div>
                        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    </motion.div>
                )}

                {step === 'mcq_chinese' && (
                    <motion.div
                        key="mcq_chinese"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="level-determination-screen"
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.levelDetermination.mcqChinese')}</h2>
                        <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>一</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>六</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(true)} style={{ fontSize: '1.5rem' }}>十二</Button>
                            <Button variant="outline" onClick={() => handleMcqAnswer(false)} style={{ fontSize: '1.5rem' }}>八</Button>
                        </div>
                        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    </motion.div>
                )}

                {step === 'write_direct' && (
                    <motion.div
                        key="write_direct"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="level-determination-screen"
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Write "12" in Chinese</h2>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                            <input
                                style={{ width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', border: '2px solid #ddd', borderRadius: '8px' }}
                                value={input1}
                                onChange={(e) => setInput1(e.target.value)}
                            />
                            <input
                                style={{ width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', border: '2px solid #ddd', borderRadius: '8px' }}
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleDirectInputSubmit}>Submit</Button>
                        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    </motion.div>
                )}

                {step === 'write_guided' && (
                    <div className="guided-writer-container">
                        {/* Reusing CharacterWriter for guided writing. 
                           Since I can't easily chain two writers in this simple block without state management,
                           I'll simulate it or just show one for "12" if possible, but 12 is two chars.
                           I will implement a simple sequential writer here.
                        */}
                        <GuidedWriter onComplete={onComplete} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function GuidedWriter({ onComplete }: { onComplete: () => void }) {
    const [charIndex, setCharIndex] = useState(0);
    const chars = ['shi', 'er']; // ten, two
    const charMap: Record<string, string> = { 'shi': '十', 'er': '二' };

    const handleCharComplete = () => {
        if (charIndex < chars.length - 1) {
            setCharIndex(i => i + 1);
        } else {
            onComplete();
        }
    };

    const currentChar = chars[charIndex];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Let's write: {charMap[currentChar]}</h3>
            <CharacterWriter
                key={currentChar}
                character={charMap[currentChar]}
                mode="demo" // Start with demo then practice? User selected "Write together". 
                // "Let's write out the answer together" implies guided.
                size={280}
                onComplete={handleCharComplete}
                autoStart={true}
            />
        </div>
    );
}
