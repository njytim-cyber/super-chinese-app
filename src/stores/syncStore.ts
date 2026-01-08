/**
 * Sync Store
 * Manages cloud synchronization of learning data via Supabase
 */

import { create } from 'zustand';
import {
    supabase,
    isSyncEnabled,
    getCurrentUser,
    UserProfile,
    SyncedCard
} from '../lib/supabase';

interface SyncState {
    // State
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncAt: Date | null;
    userId: string | null;
    userProfile: UserProfile | null;
    syncError: string | null;

    // Actions
    checkConnection: () => void;
    fetchUserProfile: () => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    syncCards: (cards: Record<string, any>) => Promise<void>;
    fetchCards: () => Promise<SyncedCard[]>;
    setZenMode: (enabled: boolean) => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncAt: null,
    userId: null,
    userProfile: null,
    syncError: null,

    checkConnection: () => {
        set({ isOnline: navigator.onLine && isSyncEnabled() });
    },

    fetchUserProfile: async () => {
        if (!supabase) return;

        try {
            const user = await getCurrentUser();
            if (!user) {
                set({ userId: null, userProfile: null });
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            set({
                userId: user.id,
                userProfile: data as UserProfile,
                syncError: null
            });
        } catch (error: any) {
            set({ syncError: error.message });
        }
    },

    updateUserProfile: async (updates) => {
        if (!supabase) return;
        const { userId } = get();
        if (!userId) return;

        try {
            set({ isSyncing: true });

            const { error } = await supabase
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;

            set(state => ({
                userProfile: state.userProfile
                    ? { ...state.userProfile, ...updates }
                    : null,
                isSyncing: false,
                lastSyncAt: new Date(),
                syncError: null
            }));
        } catch (error: any) {
            set({ isSyncing: false, syncError: error.message });
        }
    },

    syncCards: async (cards) => {
        if (!supabase) return;
        const { userId } = get();
        if (!userId) return;

        try {
            set({ isSyncing: true });

            // Convert local cards to sync format
            const syncedCards = Object.entries(cards).map(([cardId, card]: [string, any]) => ({
                user_id: userId,
                card_id: cardId,
                due: card.due,
                stability: card.stability,
                difficulty: card.difficulty,
                elapsed_days: card.elapsed_days,
                scheduled_days: card.scheduled_days,
                reps: card.reps,
                lapses: card.lapses,
                state: card.state,
                last_review: card.last_review,
                synced_at: new Date().toISOString()
            }));

            // Upsert cards (insert or update)
            const { error } = await supabase
                .from('cards')
                .upsert(syncedCards, {
                    onConflict: 'user_id,card_id',
                    ignoreDuplicates: false
                });

            if (error) throw error;

            set({
                isSyncing: false,
                lastSyncAt: new Date(),
                syncError: null
            });
        } catch (error: any) {
            set({ isSyncing: false, syncError: error.message });
        }
    },

    fetchCards: async () => {
        if (!supabase) return [];
        const { userId } = get();
        if (!userId) return [];

        try {
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            return data as SyncedCard[];
        } catch (error: any) {
            set({ syncError: error.message });
            return [];
        }
    },

    setZenMode: async (enabled) => {
        await get().updateUserProfile({ zen_mode: enabled });
    }
}));

// Listen for online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        useSyncStore.getState().checkConnection();
    });
    window.addEventListener('offline', () => {
        useSyncStore.getState().checkConnection();
    });
}

export default useSyncStore;
