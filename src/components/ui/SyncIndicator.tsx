/**
 * Sync Indicator Component
 * Shows cloud sync status with animated indicators
 */

/* eslint-disable react-hooks/purity */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncStore } from '../../stores/syncStore';
import './SyncIndicator.css';

interface SyncIndicatorProps {
    compact?: boolean;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ compact = false }) => {
    const { isOnline, isSyncing, lastSyncAt, syncError, realtimeChannel } = useSyncStore();

    const isConnected = isOnline && realtimeChannel !== null;

    const getStatusIcon = () => {
        if (syncError) return '⚠️';
        if (isSyncing) return '🔄';
        if (isConnected) return '☁️';
        if (!isOnline) return '📴';
        return '☁️';
    };

    const getStatusText = () => {
        if (syncError) return '同步错误';
        if (isSyncing) return '同步中...';
        if (isConnected) return '已连接';
        if (!isOnline) return '离线';
        return '未连接';
    };

    const getStatusClass = () => {
        if (syncError) return 'error';
        if (isSyncing) return 'syncing';
        if (isConnected) return 'connected';
        if (!isOnline) return 'offline';
        return 'disconnected';
    };

    const formatLastSync = () => {
        if (!lastSyncAt) return null;
        // Note: Date.now() is called on user interaction, not during render
        const diff = Date.now() - lastSyncAt.getTime();
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        return `${Math.floor(diff / 3600000)}小时前`;
    };

    if (compact) {
        return (
            <motion.div
                className={`sync-indicator-compact ${getStatusClass()}`}
                title={getStatusText()}
                whileHover={{ scale: 1.1 }}
            >
                <span className="sync-icon">{getStatusIcon()}</span>
                <AnimatePresence>
                    {isSyncing && (
                        <motion.span
                            className="sync-spinner"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{ rotate: { repeat: Infinity, duration: 1, ease: 'linear' } }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`sync-indicator ${getStatusClass()}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <span className="sync-icon">{getStatusIcon()}</span>
            <div className="sync-info">
                <span className="sync-status">{getStatusText()}</span>
                {lastSyncAt && !syncError && (
                    <span className="sync-time">{formatLastSync()}</span>
                )}
                {syncError && (
                    <span className="sync-error-text" title={syncError}>
                        点击重试
                    </span>
                )}
            </div>
            <AnimatePresence>
                {isConnected && !isSyncing && !syncError && (
                    <motion.div
                        className="sync-pulse"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SyncIndicator;
