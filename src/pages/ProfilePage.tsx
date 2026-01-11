import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StreakCounter, Badge, Card } from '../components';
import { useGameStore, useUserStore } from '../stores';
import { ACHIEVEMENTS } from '../types';
import './ProfilePage.css';

export function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { achievements, charactersLearned, lessonsCompleted, totalXP, currentLevel } = useGameStore();
    const { profile, setDisplayName, setAvatar } = useUserStore();
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(profile.displayName);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    const AVATARS = ['🐼', '🐶', '🐱', '🐯', '🦁', '🐨', '🐻', '🐰', '🦊', '🐸', '🐵', '🐔', '🦄', '🐲', '🐹', '🦒'];

    const handleSaveName = () => {
        setDisplayName(tempName);
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveName();
        if (e.key === 'Escape') {
            setTempName(profile.displayName);
            setIsEditingName(false);
        }
    };

    return (
        <div className="page profile-page">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← {t('common.back')}
                </button>
                <h1>{t('nav.profile')}</h1>
            </header>

            {/* Stats */}
            {/* Avatar & Ident */}
            <div className="profile-header-card">
                <div className="profile-avatar-container" onClick={() => setShowAvatarPicker(true)}>
                    <div className="profile-avatar-large">{profile.avatar}</div>
                    <div className="avatar-edit-badge">✎</div>
                </div>

                <div className="profile-identity">
                    {isEditingName ? (
                        <div className="name-edit-container">
                            <input
                                autoFocus
                                className="name-input"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={handleNameKeyDown}
                                onBlur={handleSaveName}
                            />
                        </div>
                    ) : (
                        <h2 className="profile-name" onClick={() => setIsEditingName(true)}>
                            {profile.displayName} <span className="edit-icon">✎</span>
                        </h2>
                    )}
                    <span className="profile-level">Level {currentLevel} • {totalXP} XP</span>
                </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
                {/* Reusing existing components but might want to customize if they are too big */}
                <StreakCounter size="md" />
            </div>

            {/* Avatar Picker Modal */}
            <AnimatePresence>
                {showAvatarPicker && (
                    <motion.div
                        className="avatar-picker-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAvatarPicker(false)}
                    >
                        <motion.div
                            className="avatar-picker-content"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="picker-header">
                                <h3>Choose Avatar</h3>
                                <button onClick={() => setShowAvatarPicker(false)}>✕</button>
                            </div>
                            <div className="avatar-grid">
                                {AVATARS.map(avatar => (
                                    <button
                                        key={avatar}
                                        className={`avatar-option ${profile.avatar === avatar ? 'selected' : ''}`}
                                        onClick={() => {
                                            setAvatar(avatar);
                                            setShowAvatarPicker(false);
                                        }}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default ProfilePage;
