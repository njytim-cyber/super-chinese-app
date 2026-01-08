import { motion } from 'framer-motion';
import { useGameStore } from '../../stores';
import './StreakCounter.css';

interface StreakCounterProps {
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function StreakCounter({ size = 'md', showLabel = true }: StreakCounterProps) {
    const { streak } = useGameStore();
    const isActive = streak.currentStreak > 0;

    return (
        <motion.div
            className={`streak-counter streak-counter-${size} ${isActive ? 'streak-active' : ''}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <motion.div
                className="streak-flame"
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
                🔥
            </motion.div>
            <div className="streak-info">
                <span className="streak-count">{streak.currentStreak}</span>
                {/* {showLabel && <span className="streak-label">day streak</span>} */}
            </div>
        </motion.div>
    );
}
