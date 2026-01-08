import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './HSKSelector.css';

const HSK_LEVELS = [
    { level: 1, characters: 174, words: 500, color: '#4CAF50', icon: '🌱' },
    { level: 2, characters: 173, words: 500, color: '#8BC34A', icon: '🌿' },
    { level: 3, characters: 270, words: 600, color: '#FFC107', icon: '🌻' },
    { level: 4, characters: 447, words: 600, color: '#FF9800', icon: '🌳' },
    { level: 5, characters: 636, words: 1300, color: '#FF5722', icon: '🏔️' },
    { level: 6, characters: 663, words: 2500, color: '#9C27B0', icon: '🏆' },
];

interface HSKSelectorProps {
    onSelectLevel?: (level: number) => void;
}

export function HSKSelector({ onSelectLevel }: HSKSelectorProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLevelClick = (level: number) => {
        if (onSelectLevel) {
            onSelectLevel(level);
        } else {
            navigate(`/learn/hsk${level}`);
        }
    };

    return (
        <div className="hsk-selector">
            <h2 className="hsk-title">{t('hsk.selectLevel', 'Choose Your HSK Level')}</h2>
            <p className="hsk-subtitle">{t('hsk.subtitle', 'Start where you are comfortable')}</p>

            <div className="hsk-grid">
                {HSK_LEVELS.map((hsk, index) => (
                    <motion.button
                        key={hsk.level}
                        className="hsk-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLevelClick(hsk.level)}
                        style={{ '--hsk-color': hsk.color } as React.CSSProperties}
                    >
                        <div className="hsk-icon">{hsk.icon}</div>
                        <div className="hsk-level">HSK {hsk.level}</div>
                        <div className="hsk-stats">
                            <span>{hsk.characters} {t('hsk.characters', 'characters')}</span>
                            <span>{hsk.words} {t('hsk.words', 'words')}</span>
                        </div>
                        <div className="hsk-progress-bar">
                            <div className="hsk-progress-fill" style={{ width: '0%' }}></div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
