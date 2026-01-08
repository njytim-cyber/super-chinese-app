import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../stores';
import { Button } from '../ui';
import { LanguageSelector } from './LanguageSelector';

interface SettingsModalProps {
    onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { t } = useTranslation();
    const { preferences, setTheme } = useUserStore();

    return (
        <motion.div
            className="settings-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <motion.div
                className="settings-modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--surface-container)', padding: '2rem', borderRadius: '1.5rem',
                    width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-xl)'
                }}
            >
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('settings.title')}</h2>

                {/* Theme */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.8 }}>{t('settings.theme')}</h3>
                    <div className="theme-options" style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['light', 'dark', 'system'] as const).map(theme => (
                            <button
                                key={theme}
                                className={`theme-option ${preferences.theme === theme ? 'active' : ''}`}
                                onClick={() => setTheme(theme)}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '0.5rem',
                                    border: `2px solid ${preferences.theme === theme ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                    background: 'var(--surface-container-high)', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>
                                    {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                                </span>
                                <span style={{ fontSize: '0.8rem' }}>{t(`settings.${theme}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.8 }}>{t('settings.language')}</h3>
                    <LanguageSelector variant="grid" />
                </div>

                <Button fullWidth onClick={onClose} variant="primary">
                    {t('common.done')}
                </Button>
            </motion.div>
        </motion.div>
    );
}
