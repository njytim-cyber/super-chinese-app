/**
 * Sync Store
 * Manages cloud synchronization of learning data via Supabase
 * Now with real-time subscriptions for cross-device sync
 */

import { create } from 'zustand';
import {
    supabase,
    isSyncEnabled,
    getCurrentUser
} from '../lib/supabase';
import type { UserProfile, SyncedCard } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Local card data structure for syncing
 */
interface LocalCardData {
    due: Date | string;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: 'New' | 'Learning' | 'Review' | 'Relearning';
    last_review: Date | string | null;
}

interface SyncState {
    // State
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncAt: Date | null;
    userId: string | null;
    userProfile: UserProfile | null;
    syncError: string | null;
    realtimeChannel: RealtimeChannel | null;
    pendingCards: SyncedCard[];

    // Actions
    checkConnection: () => void;
    fetchUserProfile: () => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    syncCards: (cards: Record<string, LocalCardData>) => Promise<void>;
    fetchCards: () => Promise<SyncedCard[]>;
    setZenMode: (enabled: boolean) => Promise<void>;
    subscribeToCards: () => void;
    unsubscribeFromCards: () => void;
    handleCardChange: (payload: { new?: SyncedCard; old?: SyncedCard; eventType: string }) => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncAt: null,
    userId: null,
    userProfile: null,
    syncError: null,
    realtimeChannel: null,
    pendingCards: [],

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

            // Auto-subscribe to cards after fetching profile
            get().subscribeToCards();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            set({ syncError: message });
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            set({ isSyncing: false, syncError: message });
        }
    },

    syncCards: async (cards) => {
        if (!supabase) return;
        const { userId } = get();
        if (!userId) return;

        try {
            set({ isSyncing: true });

            // Convert local cards to sync format
            const syncedCards = Object.entries(cards).map(([cardId, card]) => ({
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            set({ isSyncing: false, syncError: message });
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            set({ syncError: message });
            return [];
        }
    },

    setZenMode: async (enabled) => {
        await get().updateUserProfile({ zen_mode: enabled });
    },

    /**
     * Subscribe to real-time card changes for the current user
     */
    subscribeToCards: () => {
        if (!supabase) return;
        const { userId, realtimeChannel } = get();
        if (!userId) return;

        // Don't create duplicate subscriptions
        if (realtimeChannel) return;

        const channel = supabase
            .channel(`cards:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cards',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    get().handleCardChange({
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        new: payload.new as any,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        old: payload.old as any,
                        eventType: payload.eventType
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('🔄 Real-time SRS sync connected');
                }
            });

        set({ realtimeChannel: channel });
    },

    /**
     * Unsubscribe from real-time card changes
     */
    unsubscribeFromCards: () => {
        const { realtimeChannel } = get();
        if (realtimeChannel && supabase) {
            supabase.removeChannel(realtimeChannel);
            set({ realtimeChannel: null });
            console.log('📴 Real-time SRS sync disconnected');
        }
    },

    /**
     * Handle incoming card changes from other devices
     */
    handleCardChange: (payload) => {
        const { eventType } = payload;
        const card = payload.new;

        if (!card) return;

        // Add to pending cards for local state update
        set(state => ({
            pendingCards: [...state.pendingCards, card],
            lastSyncAt: new Date()
        }));

        console.log(`🔄 Card ${eventType}:`, card.card_id);
    }
}));

// Listen for online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        const store = useSyncStore.getState();
        store.checkConnection();
        store.subscribeToCards();
    });
    window.addEventListener('offline', () => {
        useSyncStore.getState().checkConnection();
    });
}

export default useSyncStore;

