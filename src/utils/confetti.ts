import confetti from 'canvas-confetti';

// Confetti configurations for escalating celebration
const CONFETTI_CONFIGS = [
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
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6'],
    });

    // Right side burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6'],
    });

    // Center burst
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 180,
            origin: { y: 0.4 },
            startVelocity: 50,
        });
    }, 200);
};
