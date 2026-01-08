import { motion } from 'framer-motion';
import './CelebrationOverlay.css';

interface CelebrationOverlayProps {
    message: string;
    show: boolean;
}

export function CelebrationOverlay({ message, show }: CelebrationOverlayProps) {
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
