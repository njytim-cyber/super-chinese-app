import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, LanguageSelector } from '../components';
import { useUserStore } from '../stores';
import './SettingsPage.css';

export function SettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { preferences, setTheme, toggleSound, togglePinyin } = useUserStore();

    return (
        <div className="page settings-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← {t('common.back')}
                </button>
                <h1>{t('settings.title')}</h1>
            </header>

            <div className="settings-sections">
                {/* Language */}
                <section className="settings-section">
                    <h2>{t('settings.language')}</h2>
                    <LanguageSelector variant="grid" />
                </section>

                {/* Appearance */}
                <section className="settings-section">
                    <h2>{t('settings.theme')}</h2>
                    <div className="theme-options">
                        {(['light', 'dark', 'system'] as const).map(theme => (
                            <button
                                key={theme}
                                className={`theme-option ${preferences.theme === theme ? 'active' : ''}`}
                                onClick={() => setTheme(theme)}
                            >
                                <span className="theme-icon">
                                    {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                                </span>
                                <span className="theme-label">{t(`settings.${theme}`)}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Toggles */}
                <section className="settings-section">
                    <Card variant="default" className="settings-toggles">
                        <div className="setting-row">
                            <div className="setting-info">
                                <span className="setting-icon">🔊</span>
                                <span className="setting-label">{t('settings.sound')}</span>
                            </div>
                            <button
                                className={`toggle ${preferences.soundEnabled ? 'active' : ''}`}
                                onClick={toggleSound}
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>

                        <div className="setting-row">
                            <div className="setting-info">
                                <span className="setting-icon">拼</span>
                                <span className="setting-label">{t('settings.showPinyin')}</span>
                            </div>
                            <button
                                className={`toggle ${preferences.showPinyin ? 'active' : ''}`}
                                onClick={togglePinyin}
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>
                    </Card>
                </section>

                {/* About */}
                <section className="settings-section">
                    <Card variant="default" className="about-card">
                        <p>{t('settings.version')}: 0.1.0</p>
                    </Card>
                </section>
            </div>
        </div>
    );
}
