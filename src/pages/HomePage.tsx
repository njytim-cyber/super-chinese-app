import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { XPDisplay, StreakCounter, Card, Button } from '../components';
import { useGameStore } from '../stores';
import './HomePage.css';

export function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { dailyGoalProgress, dailyGoalTarget } = useGameStore();

    const menuItems = [
        { icon: '📚', label: t('nav.learn'), path: '/learn', color: '#8b5cf6' },
        { icon: '✏️', label: t('nav.practice'), path: '/practice', color: '#f43f5e' },
        { icon: '👤', label: t('nav.profile'), path: '/profile', color: '#22c55e' },
        { icon: '⚙️', label: t('nav.settings'), path: '/settings', color: '#f59e0b' },
    ];

    return (
        <div className="page home-page">
            {/* Header with stats */}
            <header className="home-header safe-area-top">
                <XPDisplay size="sm" />
                <StreakCounter size="sm" />
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
                            <span className="menu-icon" style={{ backgroundColor: `${item.color}20` }}>
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
