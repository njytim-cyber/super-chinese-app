import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    onClick,
    className = '',
}: CardProps) {
    const isClickable = !!onClick;

    return (
        <motion.div
            className={`card card-${variant} card-padding-${padding} ${isClickable ? 'card-clickable' : ''} ${className}`}
            onClick={onClick}
            whileHover={isClickable ? { scale: 1.02 } : undefined}
            whileTap={isClickable ? { scale: 0.98 } : undefined}
        >
            {children}
        </motion.div>
    );
}
