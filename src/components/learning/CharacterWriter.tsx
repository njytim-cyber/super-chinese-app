import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import HanziWriter from 'hanzi-writer';
import './CharacterWriter.css';

export interface CharacterWriterProps {
    character: string;
    mode: 'demo' | 'quiz';
    size?: number;
    onComplete?: () => void;
    onCorrectStroke?: () => void;
    autoStart?: boolean;
}

export interface CharacterWriterRef {
    animate: () => void;
    quiz: () => void;
    reset: () => void;
}

const WRITER_OPTIONS = {
    padding: 20,
    strokeColor: '#8b5cf6',
    radicalColor: '#a78bfa',
    outlineColor: '#4a4a6a',
    drawingColor: '#f43f5e',
    showOutline: true,
    showCharacter: false,
    strokeAnimationSpeed: 1.2,
    delayBetweenStrokes: 300,
    drawingWidth: 24,
    showHintAfterMisses: 2,
};

export const CharacterWriter = forwardRef<CharacterWriterRef, CharacterWriterProps>(
    ({ character, mode, size = 280, onComplete, onCorrectStroke, autoStart = true }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const writerRef = useRef<HanziWriter | null>(null);
        const hasStartedRef = useRef(false);

        const startAnimation = useCallback(() => {
            if (!writerRef.current) return;
            writerRef.current.animateCharacter({
                onComplete: () => onComplete?.(),
            });
        }, [onComplete]);

        const startQuiz = useCallback(() => {
            if (!writerRef.current) return;
            writerRef.current.quiz({
                onComplete: () => onComplete?.(),
                onCorrectStroke: () => onCorrectStroke?.(),
            });
        }, [onComplete, onCorrectStroke]);

        const reset = useCallback(() => {
            if (writerRef.current) {
                writerRef.current.hideCharacter();
                writerRef.current.showOutline();
            }
        }, []);

        useImperativeHandle(ref, () => ({
            animate: startAnimation,
            quiz: startQuiz,
            reset,
        }), [startAnimation, startQuiz, reset]);

        useEffect(() => {
            if (!containerRef.current) return;

            // Clear any existing content
            containerRef.current.innerHTML = '';
            hasStartedRef.current = false;

            // Create writer
            writerRef.current = HanziWriter.create(containerRef.current, character, {
                ...WRITER_OPTIONS,
                width: size,
                height: size,
            });

            // Show outline immediately
            writerRef.current.showOutline();

            // Auto-start based on mode
            if (autoStart) {
                // Small delay to ensure render is complete
                const timer = setTimeout(() => {
                    if (hasStartedRef.current) return;
                    hasStartedRef.current = true;

                    if (mode === 'demo') {
                        startAnimation();
                    } else {
                        startQuiz();
                    }
                }, 300);

                return () => clearTimeout(timer);
            }

            return () => {
                writerRef.current = null;
            };
        }, [character, mode, size, autoStart, startAnimation, startQuiz]);

        return (
            <div
                ref={containerRef}
                className="character-writer"
                style={{
                    width: size,
                    height: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
        );
    }
);

CharacterWriter.displayName = 'CharacterWriter';
