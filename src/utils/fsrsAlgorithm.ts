import { DEFAULT_FSRS_PARAMETERS } from '../types/fsrs.types';
import type { FSRSCard, FSRSLog, FSRSParameters, FSRSRating } from '../types/fsrs.types';

/**
 * FSRS v4 Algorithm Implementation
 * Based on the open-source FSRS algorithm
 */

export class FSRSAlgorithm {
    private params: FSRSParameters;

    constructor(params: FSRSParameters = DEFAULT_FSRS_PARAMETERS) {
        this.params = params;
    }

    /**
     * Process a review and return the new state of the card
     */
    schedule(card: FSRSCard, rating: FSRSRating, now: Date = new Date()): { card: FSRSCard; log: FSRSLog } {
        const newCard = { ...card };
        const lastReview = card.last_review || card.due; // Fallback if new
        const elapsedDays = card.last_review
            ? (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
            : 0;

        const scheduledDays = card.scheduled_days;
        const review: Date = now;

        // Update difficulty and stability
        if (card.state === 'New') {
            this.initDS(newCard, rating);
            newCard.state = rating === 'Again' ? 'Learning' : 'Review';
            newCard.lapses = rating === 'Again' ? 1 : 0;
        } else if (card.state === 'Learning' || card.state === 'Relearning') {
            this.nextDS(newCard, rating, elapsedDays);

            // Promote to Review if Good/Easy
            if (rating === 'Good' || rating === 'Easy') {
                newCard.state = 'Review';
            } else {
                newCard.state = card.state; // Stay in learning/relearning
            }
        } else if (card.state === 'Review') {
            const success = rating !== 'Again';
            if (success) {
                this.nextDS(newCard, rating, elapsedDays);
            } else {
                this.nextDS(newCard, rating, elapsedDays);
                newCard.state = 'Relearning';
                newCard.lapses += 1;
            }
        }

        // Calculate next interval
        const nextInterval = this.nextInterval(newCard.stability, this.params.request_retention, this.params.maximum_interval);

        // Update card metadata
        newCard.elapsed_days = elapsedDays;
        newCard.scheduled_days = nextInterval;
        newCard.reps += 1;
        newCard.last_review = review;

        // Calculate new Due Date
        const nextDue = new Date(now);
        // For 'Again', usually due essentially immediately (e.g. 1 min), but for simpler day-based FSRS, we might say <1 day.
        // However, standard FSRS uses fractional days. 
        // If we are building a simple daily app, we might round up or set to 'tomorrow' unless it's 'Again'.
        // Let's adhere to the calculated days.
        if (rating === 'Again') {
            // In learning steps, 'Again' usually means show it in 1 minute.
            // We'll set due to NOW + 1 minute for immediate re-queue if we have a session runner,
            // or effectively 'Today' if we are daily.
            // For this implementation, let's treat <1 day as 'Today' or 'Next Session'.
            nextDue.setMinutes(nextDue.getMinutes() + 1);
        } else {
            nextDue.setDate(nextDue.getDate() + Math.max(1, Math.round(nextInterval)));
        }
        newCard.due = nextDue;

        const log: FSRSLog = {
            card_id: card.id,
            rating,
            state: card.state,
            due: card.due,
            review,
            elapsed_days: elapsedDays,
            scheduled_days: scheduledDays,
        };

        return { card: newCard, log };
    }

    private initDS(card: FSRSCard, rating: FSRSRating) {
        // Initial Difficulty & Stability
        // Ratings: Again=1, Hard=2, Good=3, Easy=4 (mapped from defaults)
        // Rating mapping for array index: Again=0, Hard=1, Good=2, Easy=3
        const r = this.ratingToNumber(rating) - 1;

        card.difficulty = this.params.w[4] - Math.exp(this.params.w[5] * (r + 1)) + 1;
        card.difficulty = Math.min(Math.max(card.difficulty, 1), 10);

        card.stability = this.params.w[r];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private nextDS(card: FSRSCard, rating: FSRSRating, _elapsedDays: number) {
        // Next Difficulty
        // Note: nextD and newD calculations preserved for reference but simplified version used below
        // const nextD = card.difficulty - this.params.w[6] * (r - 2);
        // const newD = card.difficulty + this.params.w[7] * (this.params.w[4] - nextD) * (1 - Math.pow(this.params.maximum_interval, -1));
        // Standard FSRS formulation: D' = D - w6 * (R - 3)
        // Note: FSRS implementation details vary slightly by version. Using v4 approx.
        let d = card.difficulty - this.params.w[6] * (this.ratingToNumber(rating) - 3);
        d = this.constrainDifficulty(this.params.w[5] * (this.params.w[4] - d) + d); // Mean reversion

        card.difficulty = d;

        // Next Stability
        if (rating === 'Again') {
            // Forgot
            card.stability = this.params.w[11] * Math.pow(card.difficulty, -this.params.w[12]) * (Math.pow(card.stability + 1, this.params.w[13]) - 1) * Math.exp(this.params.w[14] * (1 - this.params.request_retention));
        } else {
            // Recalled
            // S' = S * (1 + e^(w8) * (11-D) * S^(-w9) * (e^(w10*(1-R)) - 1))
            card.stability = card.stability * (1 + Math.exp(this.params.w[8]) *
                (11 - card.difficulty) *
                Math.pow(card.stability, -this.params.w[9]) *
                (Math.exp(this.params.w[10] * (1 - this.params.request_retention)) - 1)
            );

            // Hard penalty? (simplified)
            if (rating === 'Hard') {
                card.stability = this.params.w[15] * card.stability;
            } else if (rating === 'Easy') {
                card.stability = this.params.w[16] * card.stability;
            }
        }
    }

    // Helper to constrain difficulty 1-10
    private constrainDifficulty(d: number): number {
        return Math.min(Math.max(d, 1), 10);
    }

    private nextInterval(stability: number, textRetention: number, maxInterval: number): number {
        const newInterval = stability * 9 * (1 / textRetention - 1);
        return Math.min(Math.max(1, Math.round(newInterval)), maxInterval);
    }

    private ratingToNumber(rating: FSRSRating): number {
        switch (rating) {
            case 'Again': return 1;
            case 'Hard': return 2;
            case 'Good': return 3;
            case 'Easy': return 4;
        }
    }
}

export const fsrs = new FSRSAlgorithm();
