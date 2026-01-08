import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './XPPopup.css';

interface XPPopupProps {
    amount: number;
    show: boolean;
    onComplete?: () => void;
}

export function XPPopup({ amount, show, onComplete }: XPPopupProps) {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="xp-popup"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onAnimationComplete={() => {
                        setTimeout(() => onComplete?.(), 1500);
                    }}
                >
                    <span className="xp-popup-icon">⭐</span>
                    <span className="xp-popup-text">+{amount} {t('game.xp')}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
