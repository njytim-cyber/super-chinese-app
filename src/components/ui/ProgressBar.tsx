import { motion } from 'framer-motion';
import './ProgressBar.css';

interface ProgressBarProps {
    value: number;
    max: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'xp' | 'streak' | 'success';
    animated?: boolean;
}

export function ProgressBar({
    value,
    max,
    showLabel = false,
    size = 'md',
    variant = 'default',
    animated = true,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={`progress-container progress-${size}`}>
            <div className={`progress-track progress-${variant}`}>
                <motion.div
                    className="progress-fill"
                    initial={animated ? { width: 0 } : false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
            {showLabel && (
                <span className="progress-label">
                    {value} / {max}
                </span>
            )}
        </div>
    );
}
