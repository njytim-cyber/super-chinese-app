import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components';
import './PracticePage.css';

export function PracticePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const practiceTypes = [
        { id: 'writing', icon: '✍️', title: 'Character Writing', description: 'Practice stroke order' },
        { id: 'flashcards', icon: '🎴', title: 'Flashcards', description: 'Review vocabulary' },
        { id: 'listening', icon: '👂', title: 'Listening', description: 'Train your ear' },
        { id: 'quiz', icon: '❓', title: 'Quiz', description: 'Test your knowledge' },
    ];

    return (
        <div className="page practice-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← {t('common.back')}
                </button>
                <h1>{t('nav.practice')}</h1>
            </header>

            <div className="practice-grid">
                {practiceTypes.map(practice => (
                    <Card
                        key={practice.id}
                        variant="elevated"
                        className="practice-card"
                        onClick={() => navigate(`/practice/${practice.id}`)}
                    >
                        <span className="practice-icon">{practice.icon}</span>
                        <h3 className="practice-title">{practice.title}</h3>
                        <p className="practice-description">{practice.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
