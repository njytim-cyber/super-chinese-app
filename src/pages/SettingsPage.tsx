import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, LanguageSelector } from '../components';
import { useUserStore } from '../stores';
import './SettingsPage.css';

export function SettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        preferences,
        setTheme,
        toggleSound,
        togglePinyin,
        setLearningMode,
        setAudioSpeed
    } = useUserStore();

    const learningModes = [
        { id: 'gamified', icon: '🎮', label: 'Gamified', desc: 'Streaks, XP, achievements' },
        { id: 'zen', icon: '🧘', label: 'Zen', desc: 'No pressure, pure learning' },
        { id: 'focus', icon: '🎯', label: 'Focus', desc: 'Minimal UI, max efficiency' },
    ] as const;

    return (
        <div className="page settings-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ←
                </button>
                <h1>{t('settings.title')}</h1>
            </header>

            <div className="settings-sections">
                {/* Learning Mode - NEW */}
                <section className="settings-section">
                    <h2>🧠 Learning Mode</h2>
                    <p className="section-desc">Choose your learning style</p>
                    <div className="learning-modes">
                        {learningModes.map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-option ${preferences.learningMode === mode.id ? 'active' : ''}`}
                                onClick={() => setLearningMode(mode.id)}
                            >
                                <span className="mode-icon">{mode.icon}</span>
                                <span className="mode-label">{mode.label}</span>
                                <span className="mode-desc">{mode.desc}</span>
                            </button>
                        ))}
                    </div>
                </section>

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

                {/* Audio Speed - NEW */}
                <section className="settings-section">
                    <h2>🔊 Audio Speed</h2>
                    <div className="audio-speed-control">
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={preferences.audioSpeed}
                            onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                        />
                        <span className="speed-label">{preferences.audioSpeed.toFixed(1)}x</span>
                    </div>
                    <div className="speed-presets">
                        {[0.5, 0.75, 1.0, 1.25, 1.5].map(speed => (
                            <button
                                key={speed}
                                className={`speed-preset ${preferences.audioSpeed === speed ? 'active' : ''}`}
                                onClick={() => setAudioSpeed(speed)}
                            >
                                {speed}x
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
                        <p>{t('settings.version')}: 0.2.0</p>
                    </Card>
                </section>
            </div>
        </div>
    );
}

export default SettingsPage;
