import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components';
import './LearnPage.css';

export function LearnPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Placeholder lessons - will be populated later
    const lessons = [
        { id: 'numbers', icon: '🔢', title: 'Numbers 1-10', subtitle: '数字', progress: 40, locked: false },
        { id: 'greetings', icon: '👋', title: 'Greetings', subtitle: '问候', progress: 0, locked: false },
        { id: 'family', icon: '👨‍👩‍👧', title: 'Family', subtitle: '家庭', progress: 0, locked: true },
        { id: 'food', icon: '🍜', title: 'Food', subtitle: '食物', progress: 0, locked: true },
        { id: 'colors', icon: '🎨', title: 'Colors', subtitle: '颜色', progress: 0, locked: true },
        { id: 'animals', icon: '🐼', title: 'Animals', subtitle: '动物', progress: 0, locked: true },
    ];

    return (
        <div className="page learn-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← {t('common.back')}
                </button>
                <h1>{t('nav.learn')}</h1>
            </header>

            <div className="lessons-list">
                {lessons.map((lesson, index) => (
                    <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card
                            variant={lesson.locked ? 'default' : 'elevated'}
                            className={`lesson-card ${lesson.locked ? 'locked' : ''}`}
                            onClick={lesson.locked ? undefined : () => navigate(`/learn/${lesson.id}`)}
                        >
                            <div className="lesson-icon">{lesson.icon}</div>
                            <div className="lesson-info">
                                <h3 className="lesson-title">{lesson.title}</h3>
                                <span className="lesson-subtitle">{lesson.subtitle}</span>
                                {lesson.progress > 0 && (
                                    <div className="lesson-progress">
                                        <div className="lesson-progress-bar">
                                            <div className="lesson-progress-fill" style={{ width: `${lesson.progress}%` }} />
                                        </div>
                                        <span className="lesson-progress-text">{lesson.progress}%</span>
                                    </div>
                                )}
                            </div>
                            <div className="lesson-arrow">
                                {lesson.locked ? '🔒' : '→'}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default LearnPage;
