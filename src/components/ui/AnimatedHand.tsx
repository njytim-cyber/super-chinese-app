import { motion } from 'framer-motion';
import './AnimatedHand.css';

interface AnimatedHandProps {
    show: boolean;
}

export function AnimatedHand({ show }: AnimatedHandProps) {
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
