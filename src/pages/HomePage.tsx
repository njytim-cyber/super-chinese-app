import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StreakCounter, Card, Button, SRSDashboard } from '../components';

import { useGameStore, useUserStore } from '../stores';
import './HomePage.css';

export function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { dailyGoalProgress, dailyGoalTarget } = useGameStore();
    const { profile } = useUserStore();

    const menuItems = [
        {
            icon: '📚',
            label: t('nav.learn'),
            path: '/learn',
            style: { color: 'var(--md-sys-color-primary)', background: 'var(--md-sys-color-primary-container)' }
        },
        {
            icon: '✏️',
            label: t('nav.practice'),
            path: '/practice',
            style: { color: 'var(--md-sys-color-tertiary)', background: 'var(--md-sys-color-tertiary-container)' }
        },
        {
            icon: '📖',
            label: t('nav.reader', 'Reader'),
            path: '/reader',
            style: { color: 'var(--md-sys-color-secondary)', background: 'var(--md-sys-color-secondary-container)' }
        },
        {
            icon: '🧠',
            label: t('nav.review', 'Review'),
            path: '/review',
            style: { color: 'var(--md-sys-color-primary)', background: 'var(--md-sys-color-primary-container)' }
        },
        {
            icon: '🌉',
            label: t('nav.bridge', 'Bridge'),
            path: '/bridge',
            style: { color: 'var(--md-sys-color-secondary)', background: 'var(--md-sys-color-secondary-container)' }
        },
        {
            icon: '📕',
            label: t('nav.graded', 'Graded'),
            path: '/graded',
            style: { color: 'var(--md-sys-color-tertiary)', background: 'var(--md-sys-color-tertiary-container)' }
        },
        {
            icon: '👤',
            label: t('nav.profile'),
            path: '/profile',
            style: { color: 'var(--text-secondary)', background: 'var(--surface-container-high)' }
        },
        {
            icon: '⚙️',
            label: t('nav.settings'),
            path: '/settings',
            style: { color: 'var(--text-secondary)', background: 'var(--surface-container-high)' }
        },
    ];

    return (
        <div className="page home-page">
            {/* Header with stats */}
            <header className="home-header safe-area-top">
                <div
                    className="profile-icon-only"
                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                    onClick={() => navigate('/profile')}
                >
                    {profile.avatar}
                </div>
                <StreakCounter size="sm" />
                <button
                    onClick={() => navigate('/settings')}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                        padding: '0.5rem', marginLeft: '0.5rem'
                    }}
                >
                    ⚙️
                </button>
            </header>

            {/* Welcome Section */}
            <section className="home-welcome">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {t('app.name')} 🐼
                </motion.h1>
                <p>{t('app.tagline')}</p>
            </section>

            {/* Daily Goal */}
            <Card variant="glass" className="daily-goal-card">
                <div className="daily-goal-header">
                    <span className="daily-goal-icon">🎯</span>
                    <span className="daily-goal-title">{t('game.dailyGoal')}</span>
                </div>
                <div className="daily-goal-progress">
                    <div className="daily-goal-bar">
                        <motion.div
                            className="daily-goal-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((dailyGoalProgress / dailyGoalTarget) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="daily-goal-count">{dailyGoalProgress}/{dailyGoalTarget}</span>
                </div>
            </Card>

            {/* SRS Dashboard */}
            <SRSDashboard targetLevel={4} />

            {/* Menu Grid */}
            <nav className="home-menu">
                {menuItems.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            variant="elevated"
                            className="menu-item"
                            onClick={() => navigate(item.path)}
                        >
                            <span className="menu-icon" style={{
                                color: item.style.color,
                                backgroundColor: item.style.background
                            }}>
                                {item.icon}
                            </span>
                            <span className="menu-label">{item.label}</span>
                        </Card>
                    </motion.div>
                ))}
            </nav>

            {/* Quick Action */}
            <div className="home-cta">
                <Button size="lg" fullWidth onClick={() => navigate('/learn')}>
                    {t('common.continue')} →
                </Button>
            </div>
        </div>
    );
}

export default HomePage;
