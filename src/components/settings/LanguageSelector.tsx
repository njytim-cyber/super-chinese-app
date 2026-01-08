import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores';
import { SUPPORTED_LANGUAGES } from '../../types';
import type { SupportedLanguage } from '../../types';
import './LanguageSelector.css';

interface LanguageSelectorProps {
    variant?: 'dropdown' | 'grid';
}

export function LanguageSelector({ variant = 'dropdown' }: LanguageSelectorProps) {
    const { t } = useTranslation();
    const { preferences, setLanguage } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === preferences.language);
    const availableLanguages = SUPPORTED_LANGUAGES.filter(l => l.available);

    const handleSelect = (code: SupportedLanguage) => {
        setLanguage(code);
        setIsOpen(false);
    };

    if (variant === 'grid') {
        return (
            <div className="language-grid">
                {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        className={`language-grid-item ${lang.code === preferences.language ? 'active' : ''} ${!lang.available ? 'disabled' : ''}`}
                        onClick={() => lang.available && handleSelect(lang.code)}
                        disabled={!lang.available}
                    >
                        <span className="language-flag">{lang.flag}</span>
                        <span className="language-name">{lang.name}</span>
                        {!lang.available && <span className="language-soon">Soon</span>}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="language-selector">
            <button
                className="language-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('settings.language')}
            >
                <span className="language-flag">{currentLang?.flag}</span>
                <span className="language-code">{currentLang?.code.toUpperCase()}</span>
                <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="language-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className="language-dropdown"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {availableLanguages.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`language-option ${lang.code === preferences.language ? 'active' : ''}`}
                                    onClick={() => handleSelect(lang.code)}
                                >
                                    <span className="language-flag">{lang.flag}</span>
                                    <span className="language-name">{lang.name}</span>
                                    {lang.code === preferences.language && <span className="language-check">✓</span>}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
