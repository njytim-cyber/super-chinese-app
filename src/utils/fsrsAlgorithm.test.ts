import { describe, it, expect, beforeEach } from 'vitest';
import { FSRSAlgorithm } from './fsrsAlgorithm';
import { DEFAULT_FSRS_PARAMETERS, type FSRSCard } from '../types/fsrs.types';

describe('FSRSAlgorithm', () => {
    let fsrs: FSRSAlgorithm;
    const now = new Date('2024-01-01T12:00:00Z');

    beforeEach(() => {
        fsrs = new FSRSAlgorithm(DEFAULT_FSRS_PARAMETERS);
    });

    const createNewCard = (): FSRSCard => ({
        id: 'test-card',
        due: now,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 'New',
        last_review: undefined,
    });

    describe('schedule', () => {
        it('should schedule a new card correctly when rated "Good"', () => {
            const card = createNewCard();
            const { card: processedCard, log } = fsrs.schedule(card, 'Good', now);

            expect(processedCard.state).toBe('Review');
            expect(processedCard.reps).toBe(1);
            expect(processedCard.scheduled_days).toBeGreaterThan(0);
            expect(log.rating).toBe('Good');
        });

        it('should schedule a new card correctly when rated "Again"', () => {
            const card = createNewCard();
            const { card: processedCard, log } = fsrs.schedule(card, 'Again', now);

            expect(processedCard.state).toBe('Learning');
            expect(processedCard.lapses).toBe(1);
            expect(processedCard.reps).toBe(1);
            // Default logic sets due in 1 min for 'Again'
            expect(processedCard.due.getTime()).toBeGreaterThan(now.getTime());
            expect(log.rating).toBe('Again');
        });

        it('should update stability and difficulty on subsequent reviews', () => {
            const card = createNewCard();
            // First review: Good
            let result = fsrs.schedule(card, 'Good', now);
            let currentCard = result.card;

            // Fast forward 1 day
            const reviewTime = new Date(now);
            reviewTime.setDate(reviewTime.getDate() + 1);

            // Second review: Good
            result = fsrs.schedule(currentCard, 'Good', reviewTime);
            currentCard = result.card;

            expect(currentCard.stability).toBeGreaterThan(result.log.scheduled_days || 0);
            expect(currentCard.difficulty).toBeDefined();
            expect(currentCard.state).toBe('Review');
        });
    });
});
