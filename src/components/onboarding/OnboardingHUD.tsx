import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, useGameStore } from '../../stores';

interface OnboardingHUDProps {
    showProfile: boolean;
    showStreak: boolean;
    showXP: boolean;
    showSettingsButton: boolean;
    onSettingsClick: () => void;
}

export function OnboardingHUD({
    showProfile,
    showStreak,
    showXP,
    showSettingsButton,
    onSettingsClick
}: OnboardingHUDProps) {
    const { profile } = useUserStore();
    const { totalXP, streak } = useGameStore();

    return (
        <div className="onboarding-hud">
            <div className="hud-left">
                <AnimatePresence>
                    {showProfile && (
                        <motion.div
                            key="profile"
                            className="hud-pill"
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <span className="profile-avatar">{profile.avatar}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="hud-right">
                <AnimatePresence>
                    {showStreak && (
                        <motion.div
                            key="streak"
                            className="hud-pill"
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <span className="pill-icon">🔥</span>
                            <span className="pill-value pill-highlight">{streak.currentStreak}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {showXP && (
                        <motion.div
                            key="xp"
                            className="hud-pill"
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <span className="pill-icon" style={{ color: 'var(--md-sys-color-on-secondary)' }}>⭐</span>
                            <span className="pill-value pill-highlight">{totalXP} XP</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Settings Button - Right of XP */}
                <AnimatePresence>
                    {showSettingsButton && (
                        <motion.button
                            key="settings-btn"
                            className="hud-icon-btn"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={onSettingsClick}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'var(--surface-container-high)', border: '2px solid var(--md-sys-color-outline-variant)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', marginLeft: '0.5rem', boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
