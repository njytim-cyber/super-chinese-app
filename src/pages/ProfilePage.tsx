import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { XPDisplay, StreakCounter, Badge, Card } from '../components';
import { useGameStore } from '../stores';
import { ACHIEVEMENTS } from '../types';
import './ProfilePage.css';

export function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { achievements, charactersLearned, lessonsCompleted } = useGameStore();

    return (
        <div className="page profile-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← {t('common.back')}
                </button>
                <h1>{t('nav.profile')}</h1>
            </header>

            {/* Stats */}
            <div className="profile-stats">
                <XPDisplay size="md" />
                <StreakCounter size="md" />
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                <Card variant="glass" className="stat-card">
                    <span className="stat-value">{charactersLearned.length}</span>
                    <span className="stat-label">Characters</span>
                </Card>
                <Card variant="glass" className="stat-card">
                    <span className="stat-value">{lessonsCompleted.length}</span>
                    <span className="stat-label">Lessons</span>
                </Card>
                <Card variant="glass" className="stat-card">
                    <span className="stat-value">{achievements.length}</span>
                    <span className="stat-label">Achievements</span>
                </Card>
            </div>

            {/* Achievements */}
            <section className="profile-section">
                <h2>{t('game.achievements')}</h2>
                <div className="achievements-grid">
                    {ACHIEVEMENTS.slice(0, 6).map(achievement => (
                        <Badge
                            key={achievement.id}
                            icon={achievement.icon}
                            label={t(achievement.nameKey)}
                            unlocked={achievements.includes(achievement.id)}
                            size="md"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
