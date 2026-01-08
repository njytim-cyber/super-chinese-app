import { motion } from 'framer-motion';
import './Badge.css';

interface BadgeProps {
    icon: string;
    label: string;
    unlocked?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function Badge({
    icon,
    label,
    unlocked = true,
    size = 'md',
    showLabel = true,
}: BadgeProps) {
    return (
        <motion.div
            className={`badge badge-${size} ${unlocked ? 'badge-unlocked' : 'badge-locked'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className="badge-icon-wrapper">
                <span className="badge-icon">{icon}</span>
                {!unlocked && <div className="badge-lock">🔒</div>}
            </div>
            {showLabel && <span className="badge-label">{label}</span>}
        </motion.div>
    );
}
