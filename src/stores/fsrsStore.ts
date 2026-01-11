import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FSRSCard, FSRSLog, FSRSRating } from '../types/fsrs.types';
import { fsrs } from '../utils/fsrsAlgorithm';

interface FSRSStore {
    cards: Record<string, FSRSCard>; // Map of item ID -> FSRS Card
    logs: FSRSLog[]; // History of reviews
    deckSettings: {
        dailyNewLimit: number;
        dailyReviewLimit: number;
    };

    // Actions
    getCard: (id: string) => FSRSCard | undefined;
    addCard: (id: string) => void;
    reviewCard: (id: string, rating: FSRSRating) => void;
    getDueCards: () => FSRSCard[];
    getCounts: () => { new: number; learning: number; review: number; due: number };
}

export const useFSRSStore = create<FSRSStore>()(
    persist(
        (set, get) => ({
            cards: {},
            logs: [],
            deckSettings: {
                dailyNewLimit: 20,
                dailyReviewLimit: 100,
            },

            getCard: (id: string) => get().cards[id],

            addCard: (id: string) => {
                const { cards } = get();
                if (cards[id]) return; // Already exists

                const newCard: FSRSCard = {
                    id,
                    state: 'New',
                    stability: 0,
                    difficulty: 0,
                    elapsed_days: 0,
                    scheduled_days: 0,
                    reps: 0,
                    lapses: 0,
                    due: new Date(),
                };

                set({ cards: { ...cards, [id]: newCard } });
            },

            reviewCard: (id: string, rating: FSRSRating) => {
                const { cards, logs } = get();
                const card = cards[id];
                if (!card) return;

                const { card: updatedCard, log } = fsrs.schedule(card, rating);

                set({
                    cards: { ...cards, [id]: updatedCard },
                    logs: [...logs, log],
                });
            },

            getDueCards: () => {
                const { cards } = get();
                const now = new Date();

                // Filter due cards
                const allDue = Object.values(cards).filter(card =>
                    new Date(card.due) <= now || card.state === 'New'
                );

                // Sort by due date (oldest due first), but prioritizing Learning > Review > New?
                // Standard: interleave? Or just simple sort.
                // Simple sort by due date.
                return allDue.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
            },

            getCounts: () => {
                const { cards } = get();
                const values = Object.values(cards);
                const now = new Date();

                return {
                    new: values.filter(c => c.state === 'New').length,
                    learning: values.filter(c => c.state === 'Learning' || c.state === 'Relearning').length,
                    review: values.filter(c => c.state === 'Review').length,
                    due: values.filter(c => new Date(c.due) <= now).length
                };
            }
        }),
        {
            name: 'super-chinese-fsrs-storage',
        }
    )
);
