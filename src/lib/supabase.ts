/**
 * Supabase Client Configuration
 * Handles cloud sync for cross-platform learning progress
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Cloud sync disabled.');
}

// Create Supabase client
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
        })
        : null;

// Database types
export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
    avatar_url?: string;
    hsk_level: number;
    daily_goal: number;
    streak: number;
    total_xp: number;
    zen_mode: boolean;
    created_at: string;
    updated_at: string;
}

export interface SyncedCard {
    id: string;
    user_id: string;
    card_id: string;
    due: string;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: 'New' | 'Learning' | 'Review' | 'Relearning';
    last_review: string | null;
    synced_at: string;
}

export interface ReviewLog {
    id: string;
    user_id: string;
    card_id: string;
    rating: number;
    reviewed_at: string;
    time_taken_ms: number;
}

export interface ReadProgress {
    id: string;
    user_id: string;
    content_type: 'story' | 'news' | 'dialogue';
    content_id: string;
    progress_percent: number;
    completed: boolean;
    last_read_at: string;
}

// Check if sync is available
export const isSyncEnabled = (): boolean => supabase !== null;

// Get current user
export const getCurrentUser = async () => {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Sync not available');
    return supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Sync not available');
    return supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
    if (!supabase) return;
    return supabase.auth.signOut();
};

export default supabase;
