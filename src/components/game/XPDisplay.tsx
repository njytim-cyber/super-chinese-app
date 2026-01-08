import { motion } from 'framer-motion';
import { useGameStore } from '../../stores';
import { getLevelInfo, getXPToNextLevel } from '../../types';
import { ProgressBar } from '../ui';
import './XPDisplay.css';

interface XPDisplayProps {
    showProgress?: boolean;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export function XPDisplay({ showProgress = true, size = 'md', animated = true }: XPDisplayProps) {
    const { totalXP, currentLevel } = useGameStore();
    const levelInfo = getLevelInfo(currentLevel);
    const progress = getXPToNextLevel(totalXP);

    return (
        <motion.div
            className={`xp-display xp-display-${size}`}
            initial={animated ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="xp-level-badge">
                <span className="xp-level-icon">{levelInfo.icon}</span>
                <span className="xp-level-number">{currentLevel}</span>
            </div>
            <div className="xp-info">
                <div className="xp-header">
                    <span className="xp-title">{levelInfo.title}</span>
                    <span className="xp-amount">{totalXP} XP</span>
                </div>
                {showProgress && (
                    <ProgressBar
                        value={progress.current}
                        max={progress.required}
                        size="sm"
                        variant="xp"
                    />
                )}
            </div>
        </motion.div>
    );
}
