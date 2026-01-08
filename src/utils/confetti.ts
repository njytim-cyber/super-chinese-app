import confetti from 'canvas-confetti';

// Confetti configurations for escalating celebration
// Using consistent palette: Primary (Blue), Secondary (Amber), Tertiary (Green)
const PALETTE = ['#0077CC', '#FFC107', '#00C853', '#00A6FF', '#FFD54F'];

const CONFETTI_CONFIGS = [
    { particleCount: 30, spread: 50, origin: { y: 0.6 } },
    { particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: PALETTE.slice(0, 3) },
    { particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: PALETTE },
    {
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: PALETTE,
        startVelocity: 45,
        gravity: 0.8
    },
];

/**
 * Fire confetti celebration with intensity based on index
 */
export const fireConfetti = (index: number): void => {
    const config = CONFETTI_CONFIGS[Math.min(index, CONFETTI_CONFIGS.length - 1)];
    confetti(config);
};

/**
 * Fire a grand finale confetti burst
 */
export const fireGrandConfetti = (): void => {
    // Left side burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
        colors: PALETTE,
    });

    // Right side burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
        colors: PALETTE,
    });

    // Center burst
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 180,
            origin: { y: 0.4 },
            startVelocity: 50,
            colors: PALETTE,
        });
    }, 200);
};
